# ☁️ Panduan Integrasi AWS untuk Bank Sampah Digital IoT

## 📋 Daftar Isi
1. [Opsi Integrasi AWS](#opsi-integrasi-aws)
2. [AWS IoT Core (Recommended)](#aws-iot-core)
3. [AWS Lambda + API Gateway](#aws-lambda--api-gateway)
4. [AWS RDS (Database)](#aws-rds-database)
5. [AWS S3 (Storage)](#aws-s3-storage)
6. [Perbandingan Opsi](#perbandingan-opsi)

---

## 🎯 Opsi Integrasi AWS

### **Opsi 1: AWS IoT Core** (Recommended untuk IoT)
```
ESP32 → AWS IoT Core → Lambda → DynamoDB/RDS → Dashboard
```
**Best for:** Multiple devices, enterprise-grade IoT

### **Opsi 2: AWS Lambda + API Gateway**
```
ESP32 → API Gateway → Lambda → RDS/DynamoDB → Dashboard
```
**Best for:** Serverless, scalable API

### **Opsi 3: AWS EC2 + RDS**
```
ESP32 → EC2 (Node.js/Python) → RDS (PostgreSQL) → Dashboard
```
**Best for:** Full control, traditional architecture

### **Opsi 4: Hybrid (AWS + Supabase)**
```
ESP32 → AWS IoT Core → Lambda → Supabase → Dashboard
```
**Best for:** Keep Supabase, add AWS features

---

## 🌟 OPSI 1: AWS IoT Core (RECOMMENDED)

### **Arsitektur:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    AWS IoT CORE ARCHITECTURE                     │
└─────────────────────────────────────────────────────────────────┘

ESP32 Device
    │
    │ MQTT over TLS
    │ (Secure Connection)
    │
    ▼
AWS IoT Core
    │
    ├─► IoT Rules Engine
    │   ├─► Filter messages
    │   ├─► Transform data
    │   └─► Route to services
    │
    ├─► AWS Lambda (Process data)
    │   └─► Business logic
    │
    ├─► DynamoDB (Store transactions)
    │   └─► NoSQL database
    │
    ├─► SNS (Notifications)
    │   └─► Email/SMS alerts
    │
    └─► CloudWatch (Monitoring)
        └─► Logs & metrics

Dashboard (Next.js)
    │
    ▼
API Gateway → Lambda → DynamoDB
```

---

### **Step 1: Setup AWS IoT Core**

#### **1.1 Create IoT Thing**

```bash
# Install AWS CLI
pip install awscli

# Configure AWS credentials
aws configure
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region: ap-southeast-1 (Singapore)
# Default output format: json

# Create IoT Thing
aws iot create-thing --thing-name ESP32-BOTOL-01

# Create certificate
aws iot create-keys-and-certificate \
  --set-as-active \
  --certificate-pem-outfile certificate.pem.crt \
  --public-key-outfile public.pem.key \
  --private-key-outfile private.pem.key
```

**Output:**
```json
{
  "certificateArn": "arn:aws:iot:ap-southeast-1:123456789:cert/abc123...",
  "certificateId": "abc123...",
  "certificatePem": "-----BEGIN CERTIFICATE-----...",
  "keyPair": {
    "PublicKey": "-----BEGIN PUBLIC KEY-----...",
    "PrivateKey": "-----BEGIN RSA PRIVATE KEY-----..."
  }
}
```

**Save:**
- `certificate.pem.crt` - Device certificate
- `private.pem.key` - Private key
- `public.pem.key` - Public key

#### **1.2 Download Root CA**

```bash
# Download Amazon Root CA
wget https://www.amazontrust.com/repository/AmazonRootCA1.pem
```

#### **1.3 Create IoT Policy**

```bash
# Create policy JSON
cat > iot-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iot:Connect",
        "iot:Publish",
        "iot:Subscribe",
        "iot:Receive"
      ],
      "Resource": "*"
    }
  ]
}
EOF

# Create policy
aws iot create-policy \
  --policy-name ESP32-Policy \
  --policy-document file://iot-policy.json

# Attach policy to certificate
aws iot attach-policy \
  --policy-name ESP32-Policy \
  --target "CERTIFICATE_ARN_FROM_STEP_1"

# Attach certificate to thing
aws iot attach-thing-principal \
  --thing-name ESP32-BOTOL-01 \
  --principal "CERTIFICATE_ARN_FROM_STEP_1"
```

#### **1.4 Get IoT Endpoint**

```bash
# Get your IoT endpoint
aws iot describe-endpoint --endpoint-type iot:Data-ATS
```

**Output:**
```json
{
  "endpointAddress": "abc123xyz-ats.iot.ap-southeast-1.amazonaws.com"
}
```

**Save this endpoint!**

---

### **Step 2: ESP32 Code untuk AWS IoT**

#### **2.1 Install Libraries**

Arduino IDE → Library Manager:
- `PubSubClient` (MQTT)
- `ArduinoJson`

#### **2.2 ESP32 Code**

```cpp
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "Kost Premium";
const char* password = "kostbusripit";

// AWS IoT endpoint
const char* aws_iot_endpoint = "abc123xyz-ats.iot.ap-southeast-1.amazonaws.com";

// MQTT topics
const char* mqtt_topic_publish = "esp32/transactions";
const char* mqtt_topic_subscribe = "esp32/commands";

// AWS IoT certificates (paste dari file yang didownload)
const char* root_ca = R"EOF(
-----BEGIN CERTIFICATE-----
[Paste AmazonRootCA1.pem content here]
-----END CERTIFICATE-----
)EOF";

const char* certificate = R"EOF(
-----BEGIN CERTIFICATE-----
[Paste certificate.pem.crt content here]
-----END CERTIFICATE-----
)EOF";

const char* private_key = R"EOF(
-----BEGIN RSA PRIVATE KEY-----
[Paste private.pem.key content here]
-----END RSA PRIVATE KEY-----
)EOF";

WiFiClientSecure net;
PubSubClient client(net);

void connectAWS() {
  // Configure WiFiClientSecure
  net.setCACert(root_ca);
  net.setCertificate(certificate);
  net.setPrivateKey(private_key);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");

  // Connect to AWS IoT
  client.setServer(aws_iot_endpoint, 8883);
  client.setCallback(messageCallback);

  Serial.print("Connecting to AWS IoT");
  while (!client.connect("ESP32-BOTOL-01")) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("\nAWS IoT Connected!");

  // Subscribe to command topic
  client.subscribe(mqtt_topic_subscribe);
}

void messageCallback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received on topic: ");
  Serial.println(topic);
  
  // Parse JSON message
  StaticJsonDocument<200> doc;
  deserializeJson(doc, payload, length);
  
  // Handle commands from AWS
  const char* command = doc["command"];
  Serial.print("Command: ");
  Serial.println(command);
}

void publishTransaction(const char* user_id, int points) {
  // Create JSON payload
  StaticJsonDocument<200> doc;
  doc["device_id"] = "ESP32-BOTOL-01";
  doc["user_id"] = user_id;
  doc["points_earned"] = points;
  doc["timestamp"] = millis();

  char jsonBuffer[200];
  serializeJson(doc, jsonBuffer);

  // Publish to AWS IoT
  if (client.publish(mqtt_topic_publish, jsonBuffer)) {
    Serial.println("✅ Published to AWS IoT");
    Serial.println(jsonBuffer);
  } else {
    Serial.println("❌ Publish failed");
  }
}

void setup() {
  Serial.begin(115200);
  connectAWS();
}

void loop() {
  // Keep MQTT connection alive
  if (!client.connected()) {
    connectAWS();
  }
  client.loop();

  // Example: Publish transaction
  // publishTransaction("user-uuid-123", 10);
  
  delay(1000);
}
```

---

### **Step 3: AWS Lambda Function**

#### **3.1 Create Lambda Function**

**AWS Console → Lambda → Create Function**

**Function name:** `ProcessIoTTransaction`  
**Runtime:** Node.js 18.x  
**Architecture:** x86_64

#### **3.2 Lambda Code (Node.js)**

```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    try {
        // Parse IoT message
        const { device_id, user_id, points_earned, timestamp } = event;
        
        // Validate data
        if (!user_id || !device_id || !points_earned) {
            throw new Error('Missing required fields');
        }
        
        // Store transaction in DynamoDB
        const params = {
            TableName: 'IoTTransactions',
            Item: {
                transaction_id: `${device_id}-${timestamp}`,
                device_id: device_id,
                user_id: user_id,
                points_earned: points_earned,
                timestamp: timestamp,
                created_at: new Date().toISOString()
            }
        };
        
        await dynamodb.put(params).promise();
        console.log('✅ Transaction stored in DynamoDB');
        
        // Update user points
        const updateParams = {
            TableName: 'Users',
            Key: { user_id: user_id },
            UpdateExpression: 'ADD total_points :points',
            ExpressionAttributeValues: {
                ':points': points_earned
            }
        };
        
        await dynamodb.update(updateParams).promise();
        console.log('✅ User points updated');
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Transaction processed successfully',
                transaction_id: params.Item.transaction_id
            })
        };
        
    } catch (error) {
        console.error('❌ Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error processing transaction',
                error: error.message
            })
        };
    }
};
```

#### **3.3 Create DynamoDB Tables**

```bash
# Create Transactions table
aws dynamodb create-table \
  --table-name IoTTransactions \
  --attribute-definitions \
    AttributeName=transaction_id,AttributeType=S \
  --key-schema \
    AttributeName=transaction_id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Create Users table
aws dynamodb create-table \
  --table-name Users \
  --attribute-definitions \
    AttributeName=user_id,AttributeType=S \
  --key-schema \
    AttributeName=user_id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

---

### **Step 4: IoT Rules Engine**

#### **4.1 Create IoT Rule**

**AWS Console → IoT Core → Act → Rules → Create**

**Rule name:** `ProcessTransactionRule`

**SQL statement:**
```sql
SELECT * FROM 'esp32/transactions'
```

**Action:** Lambda → Select `ProcessIoTTransaction`

**Or via CLI:**

```bash
# Create rule
cat > iot-rule.json << EOF
{
  "sql": "SELECT * FROM 'esp32/transactions'",
  "actions": [
    {
      "lambda": {
        "functionArn": "arn:aws:lambda:ap-southeast-1:123456789:function:ProcessIoTTransaction"
      }
    }
  ]
}
EOF

aws iot create-topic-rule \
  --rule-name ProcessTransactionRule \
  --topic-rule-payload file://iot-rule.json
```

---

### **Step 5: Dashboard Integration**

#### **5.1 Create API Gateway**

**AWS Console → API Gateway → Create API → REST API**

**API name:** `IoTDashboardAPI`

**Create resources:**
- `/transactions` (GET, POST)
- `/users` (GET)
- `/devices` (GET)

#### **5.2 Lambda for API**

```javascript
// Lambda: GetTransactions
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const params = {
            TableName: 'IoTTransactions',
            Limit: 100,
            ScanIndexForward: false // Latest first
        };
        
        const result = await dynamodb.scan(params).promise();
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(result.Items)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
```

#### **5.3 Update Next.js Dashboard**

```typescript
// src/services/aws-transactions.service.ts
const AWS_API_ENDPOINT = 'https://abc123.execute-api.ap-southeast-1.amazonaws.com/prod';

export async function getTransactionsFromAWS() {
  try {
    const response = await fetch(`${AWS_API_ENDPOINT}/transactions`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from AWS:', error);
    return [];
  }
}

export async function getUsersFromAWS() {
  try {
    const response = await fetch(`${AWS_API_ENDPOINT}/users`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from AWS:', error);
    return [];
  }
}
```

---

## 💰 Estimasi Biaya AWS

### **AWS Free Tier (12 Bulan Pertama):**

| Service | Free Tier | Setelah Free Tier |
|---------|-----------|-------------------|
| **IoT Core** | 250,000 messages/month | $1.00 per 1M messages |
| **Lambda** | 1M requests/month | $0.20 per 1M requests |
| **DynamoDB** | 25 GB storage | $0.25 per GB/month |
| **API Gateway** | 1M requests/month | $3.50 per 1M requests |
| **CloudWatch** | 10 custom metrics | $0.30 per metric/month |

### **Estimasi untuk Project Anda:**

**Asumsi:**
- 1 device
- 100 transactions/day = 3,000/month
- 10 dashboard users

**Biaya per bulan:**
- IoT Core: **FREE** (< 250K messages)
- Lambda: **FREE** (< 1M requests)
- DynamoDB: **FREE** (< 25 GB)
- API Gateway: **FREE** (< 1M requests)

**Total: $0/month** (dalam free tier) ✅

---

## 🔄 OPSI 2: AWS Lambda + API Gateway (Tanpa IoT Core)

### **Arsitektur:**

```
ESP32 → API Gateway → Lambda → DynamoDB → Dashboard
```

**Lebih simple, tapi tidak ada:**
- Device management
- MQTT support
- Certificate-based security

### **ESP32 Code (HTTP):**

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* api_endpoint = "https://abc123.execute-api.ap-southeast-1.amazonaws.com/prod/transactions";
const char* api_key = "YOUR_API_KEY";

void sendToAWS(const char* user_id, int points) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(api_endpoint);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-api-key", api_key);

    StaticJsonDocument<200> doc;
    doc["device_id"] = "ESP32-BOTOL-01";
    doc["user_id"] = user_id;
    doc["points_earned"] = points;

    String jsonString;
    serializeJson(doc, jsonString);

    int httpResponseCode = http.POST(jsonString);

    if (httpResponseCode > 0) {
      Serial.printf("✅ Response: %d\n", httpResponseCode);
    } else {
      Serial.printf("❌ Error: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end();
  }
}
```

---

## 🎯 Perbandingan Opsi

| Aspek | Supabase (Sekarang) | AWS IoT Core | AWS Lambda Only |
|-------|---------------------|--------------|-----------------|
| **Setup Complexity** | ⭐ Easy | ⭐⭐⭐ Complex | ⭐⭐ Medium |
| **Cost (Small Scale)** | ⭐⭐⭐ Free | ⭐⭐⭐ Free (tier) | ⭐⭐⭐ Free (tier) |
| **Scalability** | ⭐⭐ Good | ⭐⭐⭐ Excellent | ⭐⭐⭐ Excellent |
| **Security** | ⭐⭐ Good | ⭐⭐⭐ Enterprise | ⭐⭐ Good |
| **Device Management** | ❌ No | ✅ Yes | ❌ No |
| **MQTT Support** | ❌ No | ✅ Yes | ❌ No |
| **Learning Curve** | ⭐ Easy | ⭐⭐⭐ Steep | ⭐⭐ Medium |
| **Maintenance** | ⭐⭐⭐ Low | ⭐⭐ Medium | ⭐⭐ Medium |

---

## 🎯 Rekomendasi

### **Untuk Project Anda:**

**Sekarang:** ✅ **TETAP PAKAI SUPABASE**
- Sudah working
- Simple & maintainable
- Free tier cukup
- Tidak perlu complexity AWS

**Nanti (Jika Butuh):** 
- **10+ devices** → AWS IoT Core
- **Enterprise features** → AWS IoT Core
- **Just API** → AWS Lambda + API Gateway

---

## 📝 Kesimpulan

**AWS untuk project Anda:**
- ❌ **Tidak urgent** untuk sekarang
- ✅ **Bisa dipertimbangkan** jika scaling
- 💰 **Free tier** cukup untuk small scale
- 🎓 **Learning curve** cukup steep

**Saran:**
1. Stick dengan Supabase untuk sekarang
2. Focus improve features & UX
3. Jika nanti butuh AWS, mulai dengan Lambda + API Gateway
4. Upgrade ke IoT Core jika punya banyak devices

**File lengkap:** `AWS_INTEGRATION_GUIDE.md`

# 🌐 Cara Mendapatkan IP Address Komputer

## Windows:

### Cara 1: Command Prompt
```cmd
ipconfig
```

Cari bagian:
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.XXX  ← INI IP ANDA!
```

### Cara 2: PowerShell
```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -like "*Wi-Fi*"}
```

### Cara 3: Settings
```
Settings → Network & Internet → Wi-Fi → Properties
Lihat "IPv4 address"
```

---

## Mac/Linux:

### Cara 1: Terminal
```bash
ifconfig
```

Cari bagian:
```
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	inet 192.168.1.XXX netmask 0xffffff00 broadcast 192.168.1.255  ← INI IP ANDA!
```

### Cara 2: Terminal (alternatif)
```bash
ip addr show
```

---

## ⚠️ PENTING:

1. **Gunakan IP WiFi**, bukan Ethernet
2. **ESP32 dan Komputer harus di WiFi yang SAMA**
3. **IP biasanya format**: `192.168.X.X` atau `10.0.X.X`
4. **Jangan gunakan**: `127.0.0.1` (localhost)

---

## Contoh IP yang Benar:
```
✅ 192.168.1.100
✅ 192.168.0.50
✅ 10.0.0.25
✅ 172.16.0.10

❌ 127.0.0.1 (localhost - tidak bisa diakses dari ESP32)
❌ localhost (tidak bisa diakses dari ESP32)
```

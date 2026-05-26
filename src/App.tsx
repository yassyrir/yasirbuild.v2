import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Smartphone, 
  Bot, 
  Terminal, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  AppWindow, 
  Send,
  Power
} from 'lucide-react';

interface Device {
  name: string;
  lastActive: string;
  status: 'online' | 'offline';
  blockedApps: { [key: string]: string };
}

interface LogEntry {
  id: string;
  time: string;
  type: 'info' | 'success' | 'warn' | 'error';
  message: string;
}

export default function App() {
  // States
  const [apiOnline, setApiOnline] = useState(true);
  const [senderEnabled, setSenderEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'status' | 'control' | 'logs'>('status');
  
  // Interactive "Close App" flow state
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | string | null>(null);
  
  // Simulated Devices
  const [devices, setDevices] = useState<Device[]>([
    { 
      name: "POCO F3 (Xiaomi M2012K11AG)", 
      lastActive: "Baru saja", 
      status: 'online',
      blockedApps: {}
    },
    { 
      name: "Samsung Galaxy S22 Ultra", 
      lastActive: "12 detik lalu", 
      status: 'online',
      blockedApps: { 'wa': '30 menit' }
    },
    { 
      name: "Oppo Reno 8D", 
      lastActive: "3 menit lalu", 
      status: 'offline',
      blockedApps: {}
    }
  ]);

  // Command History / Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', time: '19:40:12', type: 'info', message: 'Flask Server API DroidUtility Pro diinisialisasi pada port 5000' },
    { id: '2', time: '19:40:15', type: 'success', message: 'Bot Telegram Polling diaktifkan sukses menggunakan Token' },
    { id: '3', time: '19:42:01', type: 'success', message: 'Perangkat POCO F3 terhubung & melakukan polling pertama' },
    { id: '4', time: '19:42:15', type: 'info', message: 'Izin Kamera & File disetujui oleh perangkat POCO F3' },
    { id: '5', time: '19:45:30', type: 'warn', message: 'Perintah /cam_snap dikirim dari Bot Telegram ke POCO F3' },
    { id: '6', time: '19:45:35', type: 'success', message: 'Menerima upload foto kamera depan dari POCO F3 (camera_171661132.jpg) - Berhasil diteruskan ke Telegram' }
  ]);

  // Polling simulator
  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate random polling from connected clients
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const randomMsg = [
        "POCO F3 mengirim status poll ke endpoint /api/poll",
        "Samsung Galaxy S22 Ultra menyinkronkan status /api/status",
        "Menjaga koneksi API dengan Telegram Gateway...",
      ];
      const randomSelect = randomMsg[Math.floor(Math.random() * randomMsg.length)];
      
      setLogs(prev => [
        {
          id: String(Date.now()),
          time: timeStr,
          type: 'info',
          message: randomSelect
        },
        ...prev.slice(0, 15)
      ]);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  // Handle Command Submission
  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !selectedDevice || !selectedDuration) return;

    const matchedDevice = devices.find(d => d.name === selectedDevice);
    if (!matchedDevice) return;

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    const durationLabel = selectedDuration === 'always' 
      ? 'Selamanya (Permanen)' 
      : selectedDuration === 'pin' 
      ? 'Kunci Keamanan dengan PIN 1234' 
      : `${selectedDuration} menit`;

    // Add log entry
    setLogs(prev => [
      {
        id: String(Date.now()),
        time: timeStr,
        type: 'success',
        message: `PERINTAH CLOSE APP SENT: Menutup ${selectedApp.toUpperCase()} di ${selectedDevice} -> [ ${durationLabel} ]`
      },
      ...prev
    ]);

    // Update simulation state for device
    setDevices(prev => prev.map(d => {
      if (d.name === selectedDevice) {
        return {
          ...d,
          blockedApps: {
            ...d.blockedApps,
            [selectedApp]: durationLabel
          }
        };
      }
      return d;
    }));

    // Reset flow
    setSelectedApp(null);
    setSelectedDevice(null);
    setSelectedDuration(null);

    alert(`Perintah penutupan aplikasi terkirim sukses!\nPerangkat target segera mematikan aplikasi saat polling berikut.`);
  };

  const clearBlockedApp = (deviceName: string, appKey: string) => {
    setDevices(prev => prev.map(d => {
      if (d.name === deviceName) {
        const nextBlocks = { ...d.blockedApps };
        delete nextBlocks[appKey];
        return { ...d, blockedApps: nextBlocks };
      }
      return d;
    }));

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs(prev => [
      {
        id: String(Date.now()),
        time: timeStr,
        type: 'warn',
        message: `RESTRIKSI DIHAPUS: Blokir ${appKey.toUpperCase()} di ${deviceName} telah dihapus oleh Admin`
      },
      ...prev
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">DroidUtility Pro</h1>
            <p className="text-xs text-slate-400">Cloud Web Control Center & Metric Panel</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3 py-1 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${apiOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className="text-slate-300 font-medium">SERVER API: {apiOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3 py-1 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${senderEnabled ? 'bg-purple-500' : 'bg-amber-500'}`} />
            <span className="text-slate-300 font-medium">SENDER SAKLAR: {senderEnabled ? 'ON' : 'OFF'}</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Navigation and Controls (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Hero Banner card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-950/40 to-slate-900 border border-purple-500/10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -z-10" />
            <div className="max-w-xl">
              <span className="inline-block text-[10px] tracking-widest font-bold text-purple-400 bg-purple-950/60 border border-purple-800/50 rounded-md px-2 py-0.5 mb-3">CONSOLES READY</span>
              <h2 className="text-2xl font-bold mb-2">Android App Controller & Bot Monitor</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Dashboard ini memantau sinyal dari aplikasi Android Kotlin **DroidUtility Pro**. Anda dapat melihat status polling perangkat, melakukan simulasi blokir aplikasi secara live, dan memantau integrasi Bot Telegram secara real-time.
              </p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setApiOnline(!apiOnline)}
                  className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all border ${
                    apiOnline 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
                      : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  Simulate API {apiOnline ? 'Shutdown' : 'Startup'}
                </button>

                <button 
                  onClick={() => setSenderEnabled(!senderEnabled)}
                  className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all border ${
                    senderEnabled 
                      ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20' 
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Toggle Sender: {senderEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-slate-800">
            <button 
              onClick={() => setActiveTab('status')}
              className={`pb-3 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${activeTab === 'status' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <Smartphone className="w-4 h-4" />
              Perangkat Terhubung ({devices.filter(d => d.status === 'online').length})
            </button>
            <button 
              onClick={() => setActiveTab('control')}
              className={`pb-3 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${activeTab === 'control' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <AppWindow className="w-4 h-4" />
              Kontrol Aplikasi (Menu Tombol)
            </button>
            <button 
              onClick={() => setActiveTab('logs')}
              className={`pb-3 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${activeTab === 'logs' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <Terminal className="w-4 h-4" />
              Logs & Polling API
            </button>
          </div>

          {/* Tab 1: Connected Devices Status */}
          {activeTab === 'status' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {devices.map((dev, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-400">
                        <Smartphone className="w-3 h-3 text-purple-400" />
                        <span>ANDROID CLIENT</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${dev.status === 'online' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                        {dev.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-100 mb-1">{dev.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                      <Clock className="w-3 h-3" />
                      <span>Terakhir Aktif: {dev.lastActive}</span>
                    </div>

                    {/* Active restrictions */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Restriksi Aktif:</h4>
                      {Object.keys(dev.blockedApps).length > 0 ? (
                        <div className="flex flex-col gap-1.5">
                          {Object.entries(dev.blockedApps).map(([app, dur]) => (
                            <div key={app} className="flex items-center justify-between bg-red-950/40 border border-red-900/30 rounded-lg px-3 py-1.5 text-xs">
                              <span className="font-semibold text-red-300">🛑 {app.toUpperCase()}: Ditutup paksa</span>
                              <div className="flex items-center gap-2">
                                <span className="text-red-400">{dur}</span>
                                <button 
                                  onClick={() => clearBlockedApp(dev.name, app)}
                                  className="text-[10px] uppercase font-bold text-slate-400 hover:text-white bg-slate-800 rounded px-1.5 py-0.5"
                                >
                                  Batal
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs italic text-slate-500">Tidak ada restriksi aktif saat ini</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-900 pt-4 mt-6 flex justify-end">
                    <button 
                      onClick={() => {
                        setSelectedDevice(dev.name);
                        setActiveTab('control');
                      }}
                      disabled={dev.status === 'offline'}
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 disabled:opacity-55 disabled:cursor-not-allowed"
                    >
                      Buka Menu Kontrol Aplikasi &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Interactive Flow Control Simulation (Meniru Bot Menu) */}
          {activeTab === 'control' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-400">
                <AppWindow className="w-5 h-5" />
                Simulasi Workflow "Cek Daftar Aplikasi"
              </h3>
              
              <form onSubmit={handleSendCommand} className="space-y-6">
                {/* Step 1: Cek Daftar Aplikasi */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Langkah 1: Cek Daftar Aplikasi (Pilih Aplikasinya)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'wa', label: '🟢 WhatsApp', desc: 'wa.com' },
                      { key: 'tiktok', label: '🎵 TikTok', desc: 'tiktok.com' },
                      { key: 'yutup', label: '📺 YouTube', desc: 'youtube.com' }
                    ].map(app => (
                      <button
                        key={app.key}
                        type="button"
                        onClick={() => setSelectedApp(app.key)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          selectedApp === app.key 
                            ? 'bg-purple-950/50 border-purple-500 text-purple-300 shadow-lg shadow-purple-500/10' 
                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="font-bold text-sm mb-0.5">{app.label}</div>
                        <div className="text-[10px] text-slate-400">{app.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Pilih Perangkat yang Online */}
                {selectedApp && (
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Langkah 2: Pilih Perangkat yang Online
                    </label>
                    <div className="space-y-2">
                      {devices.map(dev => {
                        const isOnline = dev.status === 'online';
                        return (
                          <button
                            key={dev.name}
                            type="button"
                            disabled={!isOnline}
                            onClick={() => setSelectedDevice(dev.name)}
                            className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                              !isOnline 
                                ? 'bg-slate-950 border-slate-900/20 opacity-40 cursor-not-allowed text-slate-600'
                                : selectedDevice === dev.name
                                ? 'bg-purple-950/50 border-purple-500 text-purple-300 shadow-lg shadow-purple-500/10'
                                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Smartphone className={`w-4 h-4 ${selectedDevice === dev.name ? 'text-purple-400' : 'text-slate-400'}`} />
                              <div>
                                <div className="font-semibold text-sm">{dev.name}</div>
                                <div className="text-[11px] text-slate-400">Sinyal Polling Aktif • {dev.lastActive}</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
                              ONLINE
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 3: Pilih Durasi Penutupan */}
                {selectedDevice && selectedApp && (
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                      Langkah 3: Pilih Durasi & Opsi Kunci Pengaman
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 30, 60].map(dur => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setSelectedDuration(dur)}
                          className={`p-3 text-center rounded-xl border font-bold text-xs transition-all ${
                            selectedDuration === dur 
                              ? 'bg-purple-950/50 border-purple-500 text-purple-300' 
                              : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          ⏱️ {dur}m
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setSelectedDuration('always')}
                        className={`p-3 text-center rounded-xl border font-bold text-[10px] sm:text-xs transition-all ${
                          selectedDuration === 'always' 
                            ? 'bg-red-950/50 border-red-500 text-red-300 shadow-lg' 
                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        🔒 Selamanya
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDuration('pin')}
                        className={`p-3 text-center rounded-xl border font-bold text-[10px] sm:text-xs transition-all ${
                          selectedDuration === 'pin' 
                            ? 'bg-blue-950/50 border-blue-500 text-blue-300 shadow-lg' 
                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        🔑 PIN (1234)
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Command */}
                {selectedApp && selectedDevice && selectedDuration && (
                  <div className="pt-4 border-t border-slate-900 flex justify-end">
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-500/20 active:translate-y-0.5 flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      Kirim Perintah Close App
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Tab 3: Detailed Logs */}
          {activeTab === 'logs' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2 text-purple-400">
                  <Terminal className="w-5 h-5" />
                  Real-Time Event Stream Log
                </h3>
                <span className="text-xs text-slate-500 font-mono">Dijalankan pada host local</span>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 font-mono text-[11px] leading-relaxed max-h-[300px] overflow-y-auto space-y-2">
                {logs.map(log => (
                  <div key={log.id} className="flex items-start gap-2">
                    <span className="text-slate-500">[{log.time}]</span>
                    <span className={`font-bold uppercase ${
                      log.type === 'success' ? 'text-emerald-400' :
                      log.type === 'warn' ? 'text-amber-400' :
                      log.type === 'error' ? 'text-red-400' : 'text-sky-400'
                    }`}>
                      [{log.type}]
                    </span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Telegram Settings & Guide (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Telegram Settings Panel */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-md font-bold text-slate-100 flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-purple-400" />
              Telegram Bot Config
            </h3>

            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800/60 rounded-xl p-3.5 text-xs text-slate-300 leading-relaxed">
                <p className="font-semibold text-slate-100 mb-1">🤖 Menu Tombol Aktif!</p>
                Aplikasi bot sekarang menggunakan **ReplyKeyboardMarkup** dan **InlineKeyboardMarkup**. Pengguna tidak perlu mengetik perintah.
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">BOT_TOKEN (Python backend)</label>
                <input 
                  type="text" 
                  readOnly
                  value="Isikan Token Bot Bapak di /backend/api_server.py"
                  className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-400 cursor-not-allowed select-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">CHAT_ID (Foto/Galeri tujuan)</label>
                <input 
                  type="text" 
                  readOnly
                  value="Isikan Chat ID Bapak di /backend/api_server.py"
                  className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-400 cursor-not-allowed select-all"
                />
              </div>

              <div className="bg-purple-950/10 border border-purple-500/10 rounded-xl p-4">
                <h4 className="text-xs font-bold text-purple-400 mb-2">📚 Tombol Bot Terkonfigurasi:</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div className="bg-slate-900 border border-slate-800 rounded px-2 py-1 flex items-center gap-1">
                    <span>📱 Kontrol App</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded px-2 py-1 flex items-center gap-1">
                    <span>📊 Status</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded px-2 py-1 flex items-center gap-1">
                    <span>🔑 Saklar</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded px-2 py-1 flex items-center gap-1">
                    <span>📸 Foto & Galeri</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Guide */}
          <div className="bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-md font-bold mb-3 flex items-center gap-2 text-purple-400">
              <CheckCircle2 className="w-5 h-5" />
              Langkah Penggunaan
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex gap-2">
                <span className="text-purple-400 font-bold">&#9679;</span>
                <span>Jalankan backend API server (`/backend/api_server.py`) menggunakan Python.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-400 font-bold">&#9679;</span>
                <span>Buka aplikasi **DroidUtility Pro** di emulator Android atau ponsel target.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-400 font-bold">&#9679;</span>
                <span>Hubungkan aplikasi dengan mengisi IP/URL server Bapak di tab **Sistem**.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-400 font-bold">&#9679;</span>
                <span>Klik **Cek Daftar Aplikasi** di Telegram Bot atau Web Panel untuk membatasi pemakaian WA, TikTok, atau YouTube!</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500">
        <p>Copyright &copy; 2026 DroidUtility Pro Control Panel. Didesain secara eksklusif untuk platform AI Studio.</p>
      </footer>
    </div>
  );
}

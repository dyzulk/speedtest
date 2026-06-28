import React, { useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FiClock, FiTrash2, FiDownload, FiUpload, FiActivity, FiBarChart2 } from 'react-icons/fi';
import { getHistoryRecords, clearHistoryRecords, type HistoryRecord } from '@/lib/db';
import { formatSpeed } from '@/lib/utils';

export const HistoryTable: React.FC = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  const loadHistory = async () => {
    const records = await getHistoryRecords();
    setHistory(records);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClear = async () => {
    await clearHistoryRecords();
    setHistory([]);
  };

  const chartData = [...history].reverse().map((rec) => ({
    time: new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    download: Number(((rec.download * 8) / 1000000).toFixed(1)),
    upload: Number(((rec.upload * 8) / 1000000).toFixed(1)),
    latency: Number(rec.latency.toFixed(1)),
  }));

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 p-6 glass-panel rounded-3xl border border-white/10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FiClock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Measurement History & Analytics</h3>
            <p className="text-xs text-slate-400 font-mono">Synced locally & Cloudflare D1 compatible</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all"
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Clear Logs</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 text-slate-500 font-mono text-sm">
          No speedtest records found. Run a test to log history.
        </div>
      ) : (
        <Tabs.Root defaultValue="table" className="w-full">
          <Tabs.List className="flex space-x-2 mb-6 p-1.5 bg-slate-900/60 rounded-xl w-fit border border-white/5">
            <Tabs.Trigger
              value="table"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all flex items-center space-x-2"
            >
              <FiActivity className="w-4 h-4" />
              <span>Log Table</span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="chart"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all flex items-center space-x-2"
            >
              <FiBarChart2 className="w-4 h-4" />
              <span>Performance Trend</span>
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="table" className="focus:outline-none">
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300 font-mono">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[11px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4 text-blue-400">Download</th>
                    <th className="py-3.5 px-4 text-purple-400">Upload</th>
                    <th className="py-3.5 px-4 text-amber-400">Latency</th>
                    <th className="py-3.5 px-4 text-emerald-400">Jitter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {history.map((rec, idx) => {
                    const dl = formatSpeed(rec.download);
                    const ul = formatSpeed(rec.upload);
                    return (
                      <tr key={rec.id || idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 text-slate-400 font-sans">
                          {new Date(rec.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          <span className="flex items-center space-x-1.5">
                            <FiDownload className="w-3.5 h-3.5 text-blue-400" />
                            <span>{dl.value} {dl.unit}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          <span className="flex items-center space-x-1.5">
                            <FiUpload className="w-3.5 h-3.5 text-purple-400" />
                            <span>{ul.value} {ul.unit}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-amber-300 font-semibold">{rec.latency.toFixed(1)} ms</td>
                        <td className="py-3.5 px-4 text-emerald-300 font-semibold">{rec.jitter.toFixed(1)} ms</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Tabs.Content>

          <Tabs.Content value="chart" className="focus:outline-none">
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorUl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} unit="M" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area type="monotone" dataKey="download" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDl)" name="Download (Mbps)" />
                  <Area type="monotone" dataKey="upload" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorUl)" name="Upload (Mbps)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      )}
    </div>
  );
};

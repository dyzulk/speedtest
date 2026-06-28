import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FiClock, FiTrash2, FiDownload, FiUpload, FiActivity, FiBarChart2 } from 'react-icons/fi';
import { getHistoryRecords, clearHistoryRecords, type HistoryRecord } from '@/lib/db';
import { formatSpeed } from '@/lib/utils';

export const HistorySection: React.FC = () => {
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
    <section className="w-full max-w-5xl mx-auto mt-10 p-6 rounded-xl border border-border bg-card shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <FiClock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Measurement History & Analytics</h3>
            <p className="text-xs text-muted-foreground font-mono">Synced locally & Cloudflare D1 compatible</p>
          </div>
        </div>

        {history.length > 0 && (
          <Button
            onClick={handleClear}
            variant="destructive"
            size="sm"
            className="flex items-center space-x-2 text-xs font-semibold cursor-pointer"
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Clear Logs</span>
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground font-mono text-sm">
          No speedtest records found. Run a test to log history.
        </div>
      ) : (
        <Tabs defaultValue="table" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="table" className="flex items-center space-x-2 cursor-pointer">
              <FiActivity className="w-4 h-4" />
              <span>Log Table</span>
            </TabsTrigger>
            <TabsTrigger value="chart" className="flex items-center space-x-2 cursor-pointer">
              <FiBarChart2 className="w-4 h-4" />
              <span>Performance Trend</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="focus:outline-none">
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-xs sm:text-sm text-foreground font-mono">
                <thead className="bg-muted text-muted-foreground uppercase text-[11px] tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4 text-blue-500">Download</th>
                    <th className="py-3 px-4 text-purple-500">Upload</th>
                    <th className="py-3 px-4 text-amber-500">Latency</th>
                    <th className="py-3 px-4 text-emerald-500">Jitter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {history.map((rec, idx) => {
                    const dl = formatSpeed(rec.download);
                    const ul = formatSpeed(rec.upload);
                    return (
                      <tr key={rec.id || idx} className="hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 text-muted-foreground font-sans">
                          {new Date(rec.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-bold text-foreground">
                          <span className="flex items-center space-x-1.5">
                            <FiDownload className="w-3.5 h-3.5 text-blue-500" />
                            <span>{dl.value} {dl.unit}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-foreground">
                          <span className="flex items-center space-x-1.5">
                            <FiUpload className="w-3.5 h-3.5 text-purple-500" />
                            <span>{ul.value} {ul.unit}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-amber-500 font-semibold">{rec.latency.toFixed(1)} ms</td>
                        <td className="py-3 px-4 text-emerald-500 font-semibold">{rec.jitter.toFixed(1)} ms</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="chart" className="focus:outline-none">
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
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="time" stroke="#78716c" fontSize={12} tickLine={false} />
                  <YAxis stroke="#78716c" fontSize={12} tickLine={false} unit="M" />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '0.5rem', color: 'var(--foreground)' }}
                  />
                  <Area type="monotone" dataKey="download" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDl)" name="Download (Mbps)" />
                  <Area type="monotone" dataKey="upload" stroke="#a855f7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUl)" name="Upload (Mbps)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </section>
  );
};

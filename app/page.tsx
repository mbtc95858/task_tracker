'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Calendar } from '@/components/ui/Calendar';

export default function HomePage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeDays, setActiveDays] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActiveDays() {
      try {
        const response = await fetch('/api/active-days');
        if (response.ok) {
          const data = await response.json();
          setActiveDays(new Set(data.days));
        }
      } catch (error) {
        console.error('Failed to fetch active days:', error);
        setActiveDays(new Set());
      } finally {
        setLoading(false);
      }
    }
    fetchActiveDays();
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split('T')[0];
    router.push(`/calendar/${dateStr}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">加载中...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">你好，开始吧！</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Ready for today's challenges?
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">快速开始</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/tasks/new?from=home" className="block">
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-lime-400 to-lime-500 p-4 transition-all duration-300 hover:shadow-xl hover:scale-101">
                  <div className="absolute right-0 top-0 -mr-4 -mt-4 w-16 h-16 rounded-full bg-white/20 blur-2xl group-hover:bg-white/30 transition-all" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <svg className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">创建新任务</h3>
                    <p className="text-white/80 text-xs">记录你想要完成的任务</p>
                  </div>
                </div>
              </Link>

              <Link href="/projects/new?from=home" className="block">
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 transition-all duration-300 hover:shadow-xl hover:scale-101">
                  <div className="absolute right-0 top-0 -mr-4 -mt-4 w-16 h-16 rounded-full bg-white/20 blur-2xl group-hover:bg-white/30 transition-all" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <svg className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">创建新项目</h3>
                    <p className="text-white/80 text-xs">管理更大的目标和任务</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">今日进度</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">你快完成了！</p>
                  </div>
                  <div className="relative">
                    <svg className="w-24 h-24" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(163,230,53,0.2)" strokeWidth="8" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#a3e635" strokeWidth="8" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="150.72" transform="rotate(-90 50 50)" className="transition-all duration-500" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-lime-400">40%</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">目标: 至少5个推进</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">积分计划</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">25% 完成</p>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>250 积分</span>
                    <span>目标: 1000</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-gradient-to-r from-lime-400 to-lime-500 h-3 rounded-full transition-all" style={{ width: '25%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">今日概览</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Link href="/tasks" className="block">
                  <div className="group cursor-pointer">
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 dark:bg-gray-700/30 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                      <div>
                        <p className="text-4xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">12</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">总任务</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 dark:text-gray-400">进行中: 5</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/tasks" className="block">
                  <div className="group cursor-pointer">
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 transition-all duration-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30">
                      <div>
                        <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">3</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">挑战性</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 dark:text-gray-400">别害怕，慢慢来</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/dashboard" className="block">
                  <div className="group cursor-pointer">
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-lime-50 dark:bg-lime-900/20 transition-all duration-300 hover:bg-lime-100 dark:hover:bg-lime-900/30">
                      <div>
                        <p className="text-4xl font-bold text-lime-500 group-hover:text-lime-600 transition-colors">2</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">今日推进</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 dark:text-gray-400">继续加油</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="relative z-10">
            <Calendar 
              activeDays={activeDays} 
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

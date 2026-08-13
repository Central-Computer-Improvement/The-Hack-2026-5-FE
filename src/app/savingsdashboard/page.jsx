"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Leaf,
  Info,
  Calendar,
  Sprout,
  ChevronDown,
  TreePine,
} from "lucide-react";

export default function SavingsDashboardPage() {
  const [timeRange, setTimeRange] = useState("Last 6 Months");

  return (
    <div className="flex-1 bg-[#F5F8F5] p-6 md:p-10 overflow-y-auto font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Title Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1B3022] tracking-tight">
            Impact Overview
          </h1>
          <p className="text-gray-500 text-base mt-1.5">
            Track your household's financial and environmental savings.
          </p>
        </div>

        {/* Top Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Total Money Saved Card */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100/80 flex flex-col justify-between relative overflow-hidden">
            {/* Top right subtle chart icon decoration */}
            <div className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#1C482B]" />
            </div>

            <div>
              <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                Total Money Saved
              </span>
              <div className="text-4xl md:text-5xl font-black text-[#1C482B] mt-3 tracking-tight">
                Rp 1.450.000
              </div>
              <div className="text-xs font-semibold text-[#B26938] mt-2">
                +12% this month vs last month
              </div>
            </div>

            {/* Progress Bar Section */}
            <div className="mt-8 pt-4">
              <div className="flex justify-between items-center text-xs font-bold text-gray-500 mb-2">
                <span>Goal: Rp 2.000.000</span>
                <span>72%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#1C482B] rounded-full transition-all duration-1000"
                  style={{ width: "72%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Waste Prevented Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100/80 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                Waste Prevented
              </span>
              <Leaf className="w-5 h-5 text-[#1C482B]" />
            </div>

            <div className="my-4">
              <span className="text-4xl md:text-5xl font-black text-[#1B3022]">
                15.4
              </span>
              <span className="text-lg font-bold text-gray-500 ml-2">kg</span>
            </div>

            {/* Info Badge */}
            <div className="bg-[#D3F3CE] rounded-2xl p-4 flex items-start space-x-3 text-xs leading-relaxed text-[#2C4A35]">
              <div className="w-5 h-5 rounded-full bg-[#A3E099] flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-3.5 h-3.5 text-[#1B3022]" />
              </div>
              <p className="font-medium">
                Equivalent to roughly{" "}
                <span className="font-bold">30 standard meals</span> saved from
                landfill.
              </p>
            </div>
          </div>
        </div>

        {/* Middle Section: Savings Trend & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Monthly Savings Trend Chart */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100/80 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#1B3022]">
                Monthly Savings Trend
              </h3>
              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="appearance-none bg-[#F4F6F4] hover:bg-[#EAECEE] text-xs font-bold text-gray-700 py-2 pl-4 pr-8 rounded-xl border-none cursor-pointer focus:outline-none transition-colors"
                >
                  <option>Last 6 Months</option>
                  <option>Last 3 Months</option>
                  <option>This Year</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Bar Chart Container */}
            <div className="bg-[#F6F8F6] rounded-2xl p-6 h-56 flex items-end justify-between gap-3 md:gap-4">
              {/* Bar 1 */}
              <div className="flex-1 bg-[#F9A870] rounded-xl h-[35%] transition-all hover:opacity-90"></div>
              {/* Bar 2 */}
              <div className="flex-1 bg-[#F9A870] rounded-xl h-[55%] transition-all hover:opacity-90"></div>
              {/* Bar 3 */}
              <div className="flex-1 bg-[#F9A870] rounded-xl h-[45%] transition-all hover:opacity-90"></div>
              {/* Bar 4 */}
              <div className="flex-1 bg-[#2C5E3B] rounded-xl h-[78%] transition-all hover:opacity-90"></div>
              {/* Bar 5 */}
              <div className="flex-1 bg-[#2C5E3B] rounded-xl h-[70%] transition-all hover:opacity-90"></div>
              {/* Bar 6 */}
              <div className="flex-1 bg-[#1C482B] rounded-xl h-[92%] transition-all hover:opacity-90"></div>
            </div>
          </div>

          {/* Zero-Waste Achievements */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100/80 flex flex-col justify-between">
            <h3 className="text-xl font-bold text-[#1B3022] mb-6">
              Zero-Waste Achievements
            </h3>

            <div className="space-y-4">
              {/* Achievement 1 */}
              <div className="bg-[#F8F9F8] rounded-2xl p-4 flex items-center space-x-4 border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-[#FFEFE5] flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-[#D96B27]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1B3022] text-sm">
                    30 Days Streak!
                  </h4>
                  <p className="text-xs text-gray-500 font-medium leading-snug mt-0.5">
                    No expired food discarded.
                  </p>
                </div>
              </div>

              {/* Achievement 2 */}
              <div className="bg-[#F8F9F8] rounded-2xl p-4 flex items-center space-x-4 border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-[#E5F5FC] flex items-center justify-center shrink-0">
                  <Sprout className="w-5 h-5 text-[#2B9BB8]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1B3022] text-sm">
                    Compost Master
                  </h4>
                  <p className="text-xs text-gray-500 font-medium leading-snug mt-0.5">
                    Logged 5kg of scraps composted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner: CO2 Impact Badge */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#2F5233] via-[#3B653D] to-[#254228] p-8 md:p-10 shadow-lg text-white">
          {/* Background overlay pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
                CO2 Impact Badge
              </h3>
              <p className="text-emerald-100/90 text-sm md:text-base font-medium leading-relaxed">
                Your efforts this year have saved approximately 120kg of CO2
                emissions. That's like planting 5 trees!
              </p>
            </div>

            {/* Tree Icon Badge */}
            <div className="w-20 h-20 rounded-full border-4 border-white/30 bg-[#254A2B] flex items-center justify-center shadow-2xl shrink-0">
              <TreePine className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

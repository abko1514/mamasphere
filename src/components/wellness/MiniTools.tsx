"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Heart, Activity, Baby } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BMIResult, healthCalculatorService } from "@/services/healthCalculatorService";
import { pregnancyTrackerService } from "@/services/pregnancyTrackerService";

type CalculatorKey = "bmi" | "ovulation" | "pregnancy" | "period";

export default function MiniTools() {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorKey>("bmi");
  const [bmiData, setBmiData] = useState<{
    weight: string;
    height: string;
    result: BMIResult | null;
  }>({
    weight: "",
    height: "",
    result: null,
  });
  const [ovulationData, setOvulationData] = useState<{
    lastPeriod: string;
    cycleLength: number;
    result: import("@/services/healthCalculatorService").OvulationResult | null;
  }>({
    lastPeriod: "",
    cycleLength: 28,
    result: null,
  });
  const [pregnancyData, setPregnancyData] = useState<{
    lastPeriod: string;
    result: import("@/services/pregnancyTrackerService").PregnancyResult | null;
  }>({
    lastPeriod: "",
    result: null,
  });
  const [periodData, setPeriodData] = useState<{
    lastPeriod: string;
    cycleLength: number;
    history: import("@/services/healthCalculatorService").PeriodHistory[];
  }>({
    lastPeriod: "",
    cycleLength: 28,
    history: [],
  });

  // BMI Calculator
  const calculateBMI = async () => {
    if (bmiData.weight && bmiData.height) {
      const result = await healthCalculatorService.calculateBMI(
        parseFloat(bmiData.weight),
        parseFloat(bmiData.height)
      );
      setBmiData({ ...bmiData, result });
    }
  };

  // Ovulation Calculator
  const calculateOvulation = async () => {
    if (ovulationData.lastPeriod) {
      const result = await healthCalculatorService.calculateOvulation(
        ovulationData.lastPeriod,
        ovulationData.cycleLength
      );
      setOvulationData({ ...ovulationData, result });
    }
  };

  // Pregnancy Tracker
  const trackPregnancy = async () => {
    if (pregnancyData.lastPeriod) {
      const result = await pregnancyTrackerService.calculatePregnancyWeeks(
        pregnancyData.lastPeriod
      );
      setPregnancyData({ ...pregnancyData, result });
    }
  };

  // Period Tracker
  const trackPeriod = async () => {
    if (periodData.lastPeriod) {
      const history = await healthCalculatorService.generatePeriodHistory(
        periodData.lastPeriod,
        periodData.cycleLength
      );
      setPeriodData({ ...periodData, history });
    }
  };

  const renderBMIChart = () => {
    if (!bmiData.result) return null;

    const data = [
      { category: "Underweight", value: 18.5, color: "#60A5FA" },
      { category: "Normal", value: 24.9, color: "#34D399" },
      { category: "Overweight", value: 29.9, color: "#FBBF24" },
      { category: "Obese", value: 35, color: "#F87171" },
    ];

    return (
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const calculators = {
    bmi: {
      title: "BMI Calculator",
      icon: Activity,
      color: "bg-gradient-to-br from-blue-100 to-blue-200",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter weight"
                value={bmiData.weight}
                onChange={(e) =>
                  setBmiData({ ...bmiData, weight: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="Enter height"
                value={bmiData.height}
                onChange={(e) =>
                  setBmiData({ ...bmiData, height: e.target.value })
                }
              />
            </div>
          </div>
          <Button
            onClick={calculateBMI}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Calculate BMI
          </Button>
          {bmiData.result && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">
                Your BMI: {bmiData.result.bmi}
              </h3>
              <p className="text-blue-600">
                Category: {bmiData.result.category}
              </p>
              <p className="text-sm text-blue-500 mt-2">
                {bmiData.result.advice}
              </p>
            </div>
          )}
          {renderBMIChart()}
        </div>
      ),
    },
    ovulation: {
      title: "Ovulation Tracker",
      icon: Heart,
      color: "bg-gradient-to-br from-pink-100 to-pink-200",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lastPeriod">Last Period Date</Label>
              <Input
                id="lastPeriod"
                type="date"
                value={ovulationData.lastPeriod}
                onChange={(e) =>
                  setOvulationData({
                    ...ovulationData,
                    lastPeriod: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="cycleLength">Cycle Length (days)</Label>
              <Select
                value={ovulationData.cycleLength.toString()}
                onValueChange={(value) =>
                  setOvulationData({
                    ...ovulationData,
                    cycleLength: parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cycle length" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(15)].map((_, i) => (
                    <SelectItem key={i} value={(i + 21).toString()}>
                      {i + 21} days
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={calculateOvulation}
            className="w-full bg-pink-500 hover:bg-pink-600"
          >
            Calculate Ovulation
          </Button>
          {ovulationData.result && (
            <div className="p-4 bg-pink-50 rounded-lg">
              <h3 className="font-semibold text-pink-800">Fertile Window</h3>
              <p className="text-pink-600">
                Ovulation Date: {ovulationData.result.ovulationDate}
              </p>
              <p className="text-pink-600">
                Fertile Period: {ovulationData.result.fertileStart} -{" "}
                {ovulationData.result.fertileEnd}
              </p>
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={ovulationData.result.cycleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="fertility"
                      stroke="#EC4899"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      ),
    },
    pregnancy: {
      title: "Pregnancy Tracker",
      icon: Baby,
      color: "bg-gradient-to-br from-purple-100 to-purple-200",
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="pregnancyDate">Last Menstrual Period</Label>
            <Input
              id="pregnancyDate"
              type="date"
              value={pregnancyData.lastPeriod}
              onChange={(e) =>
                setPregnancyData({
                  ...pregnancyData,
                  lastPeriod: e.target.value,
                })
              }
            />
          </div>
          <Button
            onClick={trackPregnancy}
            className="w-full bg-purple-500 hover:bg-purple-600"
          >
            Track Pregnancy
          </Button>
          {pregnancyData.result && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800">
                Pregnancy Progress
              </h3>
              <p className="text-purple-600">
                Weeks: {pregnancyData.result.weeks}
              </p>
              <p className="text-purple-600">
                Trimester: {pregnancyData.result.trimester}
              </p>
              <p className="text-purple-600">
                Due Date: {pregnancyData.result.dueDate}
              </p>
              <p className="text-sm text-purple-500 mt-2">
                {pregnancyData.result.milestone}
              </p>
              <div className="w-full bg-purple-200 rounded-full h-4 mt-4">
                <div
                  className="bg-purple-500 h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${(pregnancyData.result.weeks / 40) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-purple-500 mt-2">
                {Math.round((pregnancyData.result.weeks / 40) * 100)}% Complete
              </p>
            </div>
          )}
        </div>
      ),
    },
    period: {
      title: "Period Tracker",
      icon: Calendar,
      color: "bg-gradient-to-br from-red-100 to-red-200",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="periodDate">Last Period Date</Label>
              <Input
                id="periodDate"
                type="date"
                value={periodData.lastPeriod}
                onChange={(e) =>
                  setPeriodData({ ...periodData, lastPeriod: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="periodCycle">Average Cycle (days)</Label>
              <Select
                value={periodData.cycleLength.toString()}
                onValueChange={(value) =>
                  setPeriodData({ ...periodData, cycleLength: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cycle length" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(15)].map((_, i) => (
                    <SelectItem key={i} value={(i + 21).toString()}>
                      {i + 21} days
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={trackPeriod}
            className="w-full bg-red-500 hover:bg-red-600"
          >
            Track Period
          </Button>
          {periodData.history.length > 0 && (
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-800">Period Calendar</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={periodData.history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="intensity"
                    stroke="#DC2626"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 text-sm text-red-600">
                <p>Next Period: {periodData.history[0]?.nextPeriod}</p>
                <p>Days Until: {periodData.history[0]?.daysUntil}</p>
              </div>
            </div>
          )}
        </div>
      ),
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Calculator Selection */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Health Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(calculators).map(([key, calc]) => {
              const IconComponent = calc.icon;
              return (
                <Button
                  key={key}
                  variant={activeCalculator === key ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveCalculator(key as CalculatorKey)}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {calc.title}
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Active Calculator */}
      <div className="lg:col-span-3">
        <Card className={`${calculators[activeCalculator].color} border-0`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(calculators[activeCalculator].icon, {
                className: "h-5 w-5",
              })}
              {calculators[activeCalculator].title}
            </CardTitle>
          </CardHeader>
          <CardContent>{calculators[activeCalculator].content}</CardContent>
        </Card>
      </div>
    </div>
  );
}

// components/career/sections/TipsSection.tsx
import React from "react";
import { CareerTip } from "@/models/Career";
import { BookOpen, Clock, Tag } from "lucide-react";

interface TipsSectionProps {
  tips: CareerTip[];
  loading: boolean;
}

export function TipsSection({ tips, loading }: TipsSectionProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "maternity_leave":
        return "🤱";
      case "returning_to_work":
        return "💼";
      case "career_growth":
        return "📈";
      case "work_life_balance":
        return "⚖️";
      case "networking":
        return "🤝";
      case "skills_development":
        return "🎯";
      default:
        return "💡";
    }
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 shadow-sm animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded mb-3"></div>
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Personalized Career Tips
        </h2>
        <p className="text-gray-600">
          Expert advice tailored to your current situation and goals
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tip) => (
          <div
            key={tip._id}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{getCategoryIcon(tip.category)}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {tip.title}
                </h3>
                {tip.isPersonalized && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full mt-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    AI Personalized
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">{tip.content}</p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(tip.createdAt).toLocaleDateString()}
                </span>
                {tip.relevanceScore && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {Math.round(tip.relevanceScore * 100)}% match
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-3">
              {tip.tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  <Tag size={10} />
                  {tag.replace("_", " ")}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {tips.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tips available yet
          </h3>
          <p className="text-gray-600">
            Generate AI insights to get personalized career tips
          </p>
        </div>
      )}
    </div>
  );
}

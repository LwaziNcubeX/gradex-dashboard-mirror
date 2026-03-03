"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Questions from "@/components/content/questions";
import QuizzesTab from "@/components/content/quizzes";
import LevelsTab from "@/components/content/levels";
import { FileQuestion, Layers, BookOpen } from "lucide-react";

export default function ContentPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <Tabs defaultValue="questions" className="flex flex-col gap-4">
          <TabsList className="bg-secondary/50 border border-border p-1 h-auto w-fit">
            <TabsTrigger
              value="questions"
              className="text-sm gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              <FileQuestion className="h-4 w-4" />
              Questions
            </TabsTrigger>
            <TabsTrigger
              value="quizzes"
              className="text-sm gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              <BookOpen className="h-4 w-4" />
              Quizzes
            </TabsTrigger>
            <TabsTrigger
              value="levels"
              className="text-sm gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              <Layers className="h-4 w-4" />
              Levels
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="mt-0">
            <Questions />
          </TabsContent>

          <TabsContent value="quizzes" className="mt-0">
            <QuizzesTab />
          </TabsContent>

          <TabsContent value="levels" className="mt-0">
            <LevelsTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

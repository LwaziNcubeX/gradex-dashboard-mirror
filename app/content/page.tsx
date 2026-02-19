"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Questions from "@/components/content/questions";
import QuizzesTab from "@/components/content/quizzes";
import LevelsTab from "@/components/content/levels";

export default function ContentPage() {
  return (
    <DashboardLayout>
      <Tabs defaultValue="questions" className="flex flex-col gap-4">
        <TabsList className="bg-secondary font-medium">
          <TabsTrigger
            value="questions"
            className="text-xs [&[aria-selected='true']]:bg-primary/60"
          >
            Questions
          </TabsTrigger>
          <TabsTrigger
            value="quizzes"
            className="text-xs [&[aria-selected='true']]:bg-primary/60"
          >
            Quizzes
          </TabsTrigger>
          <TabsTrigger
            value="levels"
            className="text-xs [&[aria-selected='true']]:bg-primary/60"
          >
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
    </DashboardLayout>
  );
}

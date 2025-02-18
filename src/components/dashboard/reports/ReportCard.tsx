import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const ReportCard = ({
  title,
  icon,
  description,
  content,
}: {
  title: string;
  icon: React.ReactNode;
  description: string;
  content: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {title === "Revenue" && "$"}
          {content}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;

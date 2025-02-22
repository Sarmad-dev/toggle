import { InvoiceServiceProps, Report, ReportData } from "@/types/global";
import {
  BarChart,
  BarChart2,
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  Users,
  Users2,
  Zap,
  FileText,
  FileSpreadsheet,
  ChartPie,
  File,
} from "lucide-react";
import { filteredEntries } from "./utils";
import { format } from "date-fns";

export const plans = [
  {
    name: "Free",
    description: "For individuals and small teams",
    features: [
      "Up to 2 projects",
      "5 members per project",
      "5 time entries per project",
      "Basic reporting",
    ],
    price: "$0",
    interval: "month",
  },
  {
    name: "Pro",
    description: "For growing businesses",
    features: [
      "Unlimited projects",
      "Unlimited members per project",
      "Unlimited time entries",
      "Advanced analytics & reporting",
      "Client management",
      "Custom invoicing",
      "Priority support",
    ],
    price: "$15",
    interval: "month",
  },
];

export const features = [
  {
    title: "Time Tracking",
    description:
      "Effortlessly track time spent on tasks and projects with our intuitive interface.",
    icon: Clock,
  },
  {
    title: "Team Collaboration",
    description:
      "Work seamlessly with your team members, assign tasks, and share updates in real-time.",
    icon: Users2,
  },
  {
    title: "Project Management",
    description:
      "Organize projects, set deadlines, and monitor progress all in one place.",
    icon: Calendar,
  },
  {
    title: "Real-time Analytics",
    description:
      "Get detailed insights into project performance and team productivity.",
    icon: BarChart2,
  },
  {
    title: "Team Chat",
    description:
      "Built-in chat system with file sharing and real-time notifications.",
    icon: MessageSquare,
  },
  {
    title: "Instant Updates",
    description:
      "Stay informed with real-time notifications and status updates.",
    icon: Zap,
  },
];

export const testimonials = [
  {
    content:
      "This tool has transformed how our team tracks time and manages projects. The real-time updates are game-changing!",
    author: "Sarah Johnson",
    role: "Project Manager",
    company: "Tech Solutions Inc.",
    image: "/images/testimonials/sarah.jpeg",
  },
  {
    content:
      "The best time tracking solution we've used. Clean interface and powerful features make it perfect for our agency.",
    author: "Michael Chen",
    role: "Creative Director",
    company: "Design Studio Co.",
    image: "/images/testimonials/michael.jpeg",
  },
  {
    content:
      "Incredible tool for team collaboration. The chat feature with file sharing has made communication so much easier.",
    author: "Emma Williams",
    role: "Team Lead",
    company: "Innovation Labs",
    image: "/images/testimonials/emma.jpeg",
  },
];

export const assembleReports = (data: ReportData): Report[] => {
  return [
    {
      title: "Time Tracked",
      description: "Total hours tracked this month",
      value: data?.totalHours?.toFixed(2) || "0.00",
      icon: Clock,
    },
    {
      title: "Revenue",
      description: "Total billable amount this month",
      value: data?.totalEarnings?.toFixed(2) || "0.00",
      icon: DollarSign,
    },
    {
      title: "Team Activity",
      description: "Total unique members involved",
      value: data?.totalMembers?.toString() || "0",
      icon: Users,
    },
    {
      title: "Projects",
      description: "Total projects this month",
      value: data?.activeProjects?.toString() || "0",
      icon: BarChart,
    },
  ];
};

export const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Hours Tracked per Day",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Hours",
      },
    },
    x: {
      title: {
        display: true,
        text: "Date",
      },
    },
  },
};

export const chartData = (data: ReportData) => ({
  labels: filteredEntries(data).map((entry) =>
    format(new Date(entry.date), "dd MMM")
  ),
  datasets: [
    {
      label: "Hours Tracked",
      data: filteredEntries(data).map((entry) =>
        Number(entry.hours.toFixed(2))
      ),
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.5)",
      tension: 0.1,
      fill: false,
    },
  ],
});

export const chatConfig = {
  acceptedFileTypes: "image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx",
  fileIcons: {
    "application/pdf": FileText,
    "application/msword": FileText,
    "application/vnd.ms-excel": FileSpreadsheet,
    "application/vnd.ms-powerpoint": ChartPie,
    default: File,
  },
  imagePreviewStyle: {
    position: "relative",
    width: "100%",
    maxWidth: "600px",
    margin: "auto",
  },
} as const;

export const invoiceServices: InvoiceServiceProps[] = [
  {
    id: "1",
    title: "Strategic Consulting",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    hours: 25,
    rate: 200,
    total: 5000,
  },
  {
    id: "2",
    title: "Market Research",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    hours: 40,
    rate: 150,
    total: 6000,
  },
];

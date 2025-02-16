import { BarChart2, Calendar, Clock, MessageSquare, Users2, Zap } from "lucide-react";

export const plans = [
    {
      name: "Free",
      description: "For individuals and small teams",
      features: [
        "Up to 2 projects",
        "5 members per project",
        "5 time entries per project",
        "Basic reporting"
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
        "Priority support"
      ],
      price: "$15",
      interval: "month",
    },
  ];

  export const features = [
    {
      title: "Time Tracking",
      description: "Effortlessly track time spent on tasks and projects with our intuitive interface.",
      icon: Clock,
    },
    {
      title: "Team Collaboration",
      description: "Work seamlessly with your team members, assign tasks, and share updates in real-time.",
      icon: Users2,
    },
    {
      title: "Project Management",
      description: "Organize projects, set deadlines, and monitor progress all in one place.",
      icon: Calendar,
    },
    {
      title: "Real-time Analytics",
      description: "Get detailed insights into project performance and team productivity.",
      icon: BarChart2,
    },
    {
      title: "Team Chat",
      description: "Built-in chat system with file sharing and real-time notifications.",
      icon: MessageSquare,
    },
    {
      title: "Instant Updates",
      description: "Stay informed with real-time notifications and status updates.",
      icon: Zap,
    },
  ];

  export const testimonials = [
    {
      content: "This tool has transformed how our team tracks time and manages projects. The real-time updates are game-changing!",
      author: "Sarah Johnson",
      role: "Project Manager",
      company: "Tech Solutions Inc.",
      image: "/testimonials/sarah.jpg"
    },
    {
      content: "The best time tracking solution we've used. Clean interface and powerful features make it perfect for our agency.",
      author: "Michael Chen",
      role: "Creative Director",
      company: "Design Studio Co.",
      image: "/testimonials/michael.jpg"
    },
    {
      content: "Incredible tool for team collaboration. The chat feature with file sharing has made communication so much easier.",
      author: "Emma Williams",
      role: "Team Lead",
      company: "Innovation Labs",
      image: "/testimonials/emma.jpg"
    },
  ];
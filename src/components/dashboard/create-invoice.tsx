"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createInvoice } from "@/lib/actions/invoices";
import { useUser } from "@/hooks/use-user";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { invoiceTemplates, TemplateId } from "@/lib/invoice-templates";
import { Card } from "@/components/ui/card";
import { uploadFile } from "@/lib/storage";
import { FilePreview } from "@/types/global";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceServices } from "@/lib/constants";
import Image from "next/image";

// Step definitions
type FormStep = "template" | "branding" | "details" | "services";

const formSchema = z.object({
  template: z.string().min(1, "Template is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  logo: z.string().optional(),
  signature: z.string().optional(),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email().optional(),
  clientAddress: z.string().min(1, "Address is required"),
  dueDate: z.date(),
  paymentTerms: z.string().min(1),
  notes: z.string().optional(),
  taxRate: z.coerce.number().min(0).max(100),
  discount: z.coerce.number().min(0).optional().nullable(),
  services: z.array(z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    hours: z.string().regex(/^\d+\.?\d*$/, "Invalid hours"),
    rate: z.string().regex(/^\d+\.?\d*$/, "Invalid rate"),
  })).min(1, "At least one service is required"),
});

interface CreateInvoiceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInvoice({ open, onOpenChange }: CreateInvoiceProps) {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState<FormStep>("template");
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateId>("Professional");
  const [logo, setLogo] = useState<FilePreview | null>(null);
  const [signature, setSignature] = useState<FilePreview | null>(null);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      template: "Professional",
      invoiceNumber: `INV-${Date.now()}`,
      dueDate: new Date(),
      logo: "",
      signature: "",
      clientName: "",
      clientEmail: "",
      clientAddress: "",
      taxRate: 0,
      discount: 0,
      notes: "",
      paymentTerms: "",
      services: [{
        title: "",
        description: "",
        hours: "",
        rate: "",
      }],
    },
  });

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setUploadFile: (file: FilePreview) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newFile = {
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
    };

    setUploadFile(newFile);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "template":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Select Template</h3>
            <div className="flex flex-col gap-6">
              {Object.entries(invoiceTemplates).map(([id, template]) => (
                <Card
                  key={id}
                  className={`p-2 cursor-pointer transition-all min-h-[300px] ${
                    selectedTemplate === id
                      ? "ring-2 ring-primary"
                      : "hover:ring-1 ring-gray-200"
                  }`}
                  style={{ backgroundColor: template?.colors?.background }}
                  onClick={() => {
                    setSelectedTemplate(id as TemplateId);
                    form.setValue("template", id);
                  }}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-hidden rounded-lg">
                      <div className="scale-75 origin-top">
                        {template?.preview({
                          taxRate: "10",
                          notes: "This is a test invoice",
                          paymentTerms: "NET 15",
                          dueDate: new Date(),
                          createdAt: new Date(),
                          invoiceNumber: "INVOICE-1234567890",
                          clientName: "John Doe",
                          clientEmail: "john.doe@example.com",
                          clientAddress: "123 Main St, Anytown, USA",
                          logo: "https://png.pngtree.com/png-clipart/20190604/original/pngtree-creative-company-logo-png-image_1197025.jpg",
                          signature: "https://signaturely.com/wp-content/uploads/2020/04/mark-cuban-signature-signaturely-image.png",
                          services: invoiceServices
                        })}
                      </div>
                    </div>
                    <div className="mt-4 text-center px-4 pb-2">
                      <h4
                        className={`${template?.typography?.header}`}
                        style={{ color: template?.colors?.text }}
                      >
                        {template?.name}
                      </h4>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setCurrentStep("branding")}>Next</Button>
            </div>
          </div>
        );

      case "branding":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Branding</h3>
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="logo"
                render={() => (
                  <FormItem>
                    <FormLabel>Company Logo</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            handleFileUpload(e, setLogo);
                          }}
                        />
                        {logo?.preview && (
                          <Image
                            src={logo?.preview}
                            alt="Logo preview"
                            className="h-16 w-16 object-contain rounded-md"
                            width={64}
                            height={64}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="signature"
                render={() => (
                  <FormItem>
                    <FormLabel>E-Signature</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            handleFileUpload(e, setSignature);
                          }}
                        />
                        {signature?.preview && (
                          <Image
                            src={signature?.preview}
                            alt="Signature preview"
                            className="h-16 w-32 object-contain"
                            width={128}
                            height={64}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("template")}
              >
                Back
              </Button>
              <Button onClick={() => setCurrentStep("details")}>Next</Button>
            </div>
          </div>
        );

      case "details":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Invoice Details</h3>
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          if (date) field.onChange(date);
                        }}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Terms</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("branding")}
              >
                Back
              </Button>
              <Button onClick={() => setCurrentStep("services")}>Next</Button>
            </div>
          </div>
        );

      case "services":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Services</h3>
            {form.watch("services").map((_, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <FormField
                  control={form.control}
                  name={`services.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`services.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`services.${index}.hours`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hours</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`services.${index}.rate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rate</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      const services = form.getValues("services");
                      form.setValue("services", services.filter((_, i) => i !== index));
                    }}
                  >
                    Remove Service
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const services = form.getValues("services");
                form.setValue("services", [
                  ...services,
                  { title: "", description: "", hours: "", rate: "" },
                ]);
              }}
            >
              Add Service
            </Button>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep("details")}>
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" /> Creating...
                  </>
                ) : (
                  "Create Invoice"
                )}
              </Button>
            </div>
          </div>
        );
    }
  };

  const { mutateAsync } = useMutation({
    mutationKey: ["createInvoice"],
    mutationFn: async (values: {
      template: string;
      invoiceNumber: string;
      logo: string | null;
      signature: string | null;
      clientName: string;
      clientEmail: string | null;
      clientAddress: string;
      dueDate: Date;
      paymentTerms: string;
      notes: string | null;
      taxRate: string;
      discount: string | null;
      userId: string;
      services: {
        title: string;
        description: string | null;
        hours: string;
        rate: string;
        total: string;
      }[];
    }) => await createInvoice(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;

    try {
      const uploadedLogo = await uploadFile(logo?.file as File, "images");
      const uploadedSignature = await uploadFile(
        signature?.file as File,
        "images"
      );
      const invoiceData = {
        ...values,
        template: selectedTemplate,
        clientName: values.clientName,
        paymentTerms: values.paymentTerms,
        invoiceNumber: values.invoiceNumber,
        taxRate: values.taxRate.toString(),
        discount: values.discount?.toString() ?? null,
        notes: values.notes ?? null,
        clientEmail: values.clientEmail ?? null,
        logo: uploadedLogo?.url ?? null,
        signature: uploadedSignature?.url ?? null,
        dueDate: new Date(values.dueDate),
        userId: user.id,
        status: "PENDING",
        services: values.services.map(service => ({
          title: service.title,
          description: service.description || null,
          hours: service.hours,
          rate: service.rate,
          total: (parseFloat(service.hours) * parseFloat(service.rate)).toString(),
        })),
      };

      await mutateAsync(invoiceData);

      // Generate PDF after successful creation
      // await generateInvoicePDF(
      //   "invoice-preview",
      //   `invoice-${createdInvoice.invoiceNumber}`,
      //   values.template
      // );

      toast.success("Invoice created successfully");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error creating invoice: ", error);
      toast.error("Failed to create invoice");
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  // const handleDownloadPDF = () => {
  //   generateInvoicePDF(
  //     "invoice-preview",
  //     `invoice-${form.getValues("invoiceNumber")}`,
  //     form.getValues("template")
  //   );
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Invoice</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStep()}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

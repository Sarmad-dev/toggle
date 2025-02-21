
import { InvoiceServiceProps } from "@/types/global";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";

export interface InvoiceTemplate {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent?: string;
  };
  typography: {
    header: string;
    body: string;
  };
  layout: string;
  preview: (props: {
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    logo: string;
    signature: string;
    createdAt: Date;
    dueDate: Date;
    paymentTerms: string;
    taxRate: string;
    notes: string;
    services: InvoiceServiceProps[];
  }) => React.JSX.Element;
}

const ImageComponent = ({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) => {
  // Check if we're in a PDF context (temp-invoice div exists)
  const isPDF =
    typeof document !== "undefined" &&
    document.getElementById("temp-invoice") !== null;

  return isPDF ? (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ objectFit: "cover" }}
    />
  ) : (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

export const invoiceTemplates: Record<string, InvoiceTemplate> = {
  professional: {
    name: "Professional",
    colors: {
      primary: "#059669",
      secondary: "#047857",
      background: "#f8fafc",
      text: "#1e293b",
      accent: "#d1fae5",
    },
    typography: {
      header: "text-2xl font-semibold uppercase",
      body: "text-sm",
    },
    layout: "horizontal",
    preview: ({
      invoiceNumber,
      clientName,
      clientEmail,
      clientAddress,
      logo,
      createdAt,
      dueDate,
      paymentTerms,
      taxRate,
      notes,
      services,
    }) => {
      const taxDecimal = new Prisma.Decimal(taxRate);
      const taxAmount = taxRate
        ? taxDecimal
            .mul(services.reduce((acc, service) => acc + service.total, 0))
            .div(100)
        : new Prisma.Decimal(0);
      return (
        <div className="p-8 w-[210mm] min-h-[297mm] bg-background rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <div className="h-[80px] w-[80px] relative">
              <ImageComponent
                src={logo}
                alt="Logo"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-right">
              <p className="font-medium text-primary">INVOICE</p>
              <p className="text-sm text-muted-foreground">
                {invoiceNumber || "#PRO-2024-001"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Client Information</h3>
              <p>{clientName || "Global Enterprises Ltd."}</p>
              <p>{clientEmail || "abc@gmail.com"}</p>
              <p>{clientAddress || "789 Corporate Blvd."}</p>
            </div>
            <div className="text-right">
              <p>
                <span className="font-semibold">Issued:</span>{" "}
                {format(new Date(createdAt), "PP")}
              </p>
              <p>
                <span className="font-semibold">Due:</span>{" "}
                {format(new Date(dueDate), "PP")}
              </p>
              <p>
                <span className="font-semibold">Terms:</span>{" "}
                {paymentTerms || "NET 15"}
              </p>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead className="bg-accent">
              <tr>
                <th className="text-left p-3 text-sm">Service Description</th>
                <th className="p-3 text-sm">Hours</th>
                <th className="p-3 text-sm">Rate</th>
                <th className="p-3 text-sm">Total</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr className="border-b" key={service.id}>
                  <td className="text-left p-3 text-sm">{service.title}</td>
                  <td className="p-3 text-center text-sm">{`${service.hours} hrs`}</td>
                  <td className="p-3 text-center text-sm">
                    ${`${service.rate}`}
                  </td>
                  <td className="p-3 text-center text-sm">
                    ${`${service.total}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="p-4 bg-accent/20 rounded-lg">
                <p className="text-sm font-medium">Payment Instructions</p>
                <p className="text-xs text-muted-foreground">
                  {notes || "Bank Transfer to Account: 1234-5678"}
                </p>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="flex justify-between">
                <span>Tax {taxRate || "0%"}:</span>
                <span>{`${taxAmount}`}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Due:</span>
                <span>{`${new Prisma.Decimal(
                  services.reduce((acc, service) => acc + service.total, 0)
                ).add(taxAmount)}`}</span>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  creative: {
    name: "Creative",
    colors: {
      primary: "#7c3aed",
      secondary: "#6d28d9",
      background: "#f5f3ff",
      text: "#334155",
      accent: "#ede9fe",
    },
    typography: {
      header: "text-3xl font-bold italic",
      body: "text-base",
    },
    layout: "vertical",
    preview: ({
      invoiceNumber,
      clientName,
      clientEmail,
      clientAddress,
      logo,
      signature,
      createdAt,
      dueDate,
      paymentTerms,
      taxRate,
      notes,
      services,
    }) => {
      const taxDecimal = new Prisma.Decimal(taxRate);
      const taxAmount = taxRate
        ? taxDecimal
            .mul(services.reduce((acc, service) => acc + service.total, 0))
            .div(100)
        : new Prisma.Decimal(0);

      return (
        <div className="p-8 w-[210mm] min-h-[297mm] bg-background rounded-lg shadow-xl">
          <div className="text-center mb-8">
            <div className="bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="relative h-20 w-20 rounded-full">
                <ImageComponent
                  src={logo}
                  alt="Logo"
                  width={80}
                  height={80}
                  className="rounded-full w-20 h-20 object-cover"
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold italic text-primary">INVOICE</h1>
            <p className="text-muted-foreground text-lg">{invoiceNumber}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <h3 className="font-bold text-xl">BILLED TO</h3>
              <p className="font-medium text-lg">{clientName}</p>
              <p className="text-muted-foreground text-lg">{clientEmail}</p>
              <p className="text-muted-foreground whitespace-pre-line text-lg">
                {clientAddress}
              </p>
            </div>
            <div className="space-y-2 text-right">
              <div>
                <h3 className="font-bold text-xl">DETAILS</h3>
                <p className="text-muted-foreground text-lg">
                  Issue Date: {format(new Date(createdAt), "PPP")}
                </p>
                <p className="text-muted-foreground text-lg">
                  Due Date: {format(new Date(dueDate), "PPP")}
                </p>
                <p className="text-muted-foreground text-lg">
                  Terms: {paymentTerms}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="py-3 text-lg text-left">Service</th>
                  <th className="text-center py-3 text-lg">Hours</th>
                  <th className="text-center py-3 text-lg">Rate</th>
                  <th className="text-center py-3 text-lg">Total</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-b">
                    <td className="py-3">
                      <div className="font-medium text-lg">{service.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {service.description}
                      </div>
                    </td>
                    <td className="py-3 text-center text-lg">
                      {service.hours}
                    </td>
                    <td className="py-3 text-center text-lg">
                      ${service.rate}
                    </td>
                    <td className="py-3 text-center text-lg">
                      ${service.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="p-4 bg-accent/30 rounded-lg">
                <p className="font-medium text-lg">Notes</p>
                <p className="text-muted-foreground">{notes}</p>
              </div>
              {signature && (
                <div className="mt-8">
                  <ImageComponent
                    src={signature}
                    alt="Signature"
                    width={150}
                    height={50}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Authorized Signature
                  </p>
                </div>
              )}
            </div>
            <div className="text-right space-y-2">
              <div className="flex justify-between text-lg">
                <span>Subtotal:</span>
                <span>
                  $
                  {services.reduce(
                    (acc, service) => acc + Number(service.total),
                    0
                  )}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Tax ({taxRate}%):</span>
                <span>${taxAmount.toString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span className="text-primary">
                  $
                  {new Prisma.Decimal(
                    services.reduce(
                      (acc, service) => acc + Number(service.total),
                      0
                    )
                  )
                    .add(taxAmount)
                    .toString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  minimalist: {
    name: "Minimalist Modern",
    colors: {
      primary: "#2E3A59", // Deep Navy Blue
      secondary: "#F4F6FA", // Light Gray
      background: "#FFFFFF", // White
      text: "#333333", // Dark Gray
      accent: "#FF6B6B", // Coral Red
    },
    typography: {
      header: "'Poppins', sans-serif",
      body: "'Open Sans', sans-serif",
    },
    layout: "clean-columns",
    preview: (props) => (
      <div style={{ fontFamily: "'Poppins', sans-serif", color: "#333333" }}>
        <header
          style={{
            backgroundColor: "#2E3A59",
            padding: "20px",
            color: "#FFFFFF",
          }}
        >
          <h1>Invoice #{props.invoiceNumber}</h1>
        </header>
        <main style={{ padding: "20px", backgroundColor: "#F4F6FA" }}>
          <section>
            <p>
              <strong>Client:</strong> {props.clientName}
            </p>
            <p>
              <strong>Email:</strong> {props.clientEmail}
            </p>
            <p>
              <strong>Address:</strong> {props.clientAddress}
            </p>
          </section>
          <section>
            <p>
              <strong>Due Date:</strong> {props.dueDate.toDateString()}
            </p>
            <p>
              <strong>Payment Terms:</strong> {props.paymentTerms}
            </p>
          </section>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #2E3A59" }}>
                <th className="text-left">Title</th>
                <th className="text-left">Description</th>
                <th className="text-center">Hours</th>
                <th className="text-center">Rate</th>
                <th className="text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {props.services.map((service, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #CCCCCC" }}>
                  <td>{service.title}</td>
                  <td className="w-[500px]">{service.description}</td>
                  <td className="text-center">{service.hours}</td>
                  <td className="text-center">${service.rate.toFixed(2)}</td>
                  <td className="text-center">${service.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
        <footer
          style={{
            backgroundColor: "#FF6B6B",
            color: "#FFFFFF",
            padding: "10px",
            textAlign: "center",
          }}
        >
          Thank you for your business!
        </footer>
      </div>
    ),
  },
  elegant: {
    name: "Elegant Corporate",
    colors: {
      primary: "#4A4E69", // Muted Blue
      secondary: "#C9ADA7", // Soft Pink
      background: "#F2E8CF", // Cream
      text: "#222222", // Black
      accent: "#9A8C98", // Dusty Purple
    },
    typography: {
      header: "'Playfair Display', serif",
      body: "'Lora', serif",
    },
    layout: "classic-two-column",
    preview: (props) => (
      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          color: "#222222",
          backgroundColor: "#F2E8CF",
          padding: "20px",
        }}
      >
        <header style={{ textAlign: "center", marginBottom: "20px" }}>
          <ImageComponent
            src={props.logo}
            alt="Company Logo"
            className="max-w-[150px]"
            width={150}
            height={150}
          />
          <h1 style={{ color: "#4A4E69" }}>Invoice #{props.invoiceNumber}</h1>
        </header>
        <main style={{ display: "flex", justifyContent: "space-between" }}>
          <section>
            <h3>Billed To:</h3>
            <p>{props.clientName}</p>
            <p>{props.clientEmail}</p>
            <p>{props.clientAddress}</p>
          </section>
          <section>
            <h3>Invoice Details:</h3>
            <p>
              <strong>Date:</strong> {props.createdAt.toDateString()}
            </p>
            <p>
              <strong>Due Date:</strong> {props.dueDate.toDateString()}
            </p>
          </section>
        </main>
        <table
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#C9ADA7", color: "#FFFFFF" }}>
              <th className="text-left">Title</th>
              <th className="text-left">Description</th>
              <th className="text-center">Hours</th>
              <th className="text-center">Rate</th>
              <th className="text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {props.services.map((service, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #9A8C98" }}>
                <td>{service.title}</td>
                <td className="w-[500px]">{service.description}</td>
                <td className="text-center">{service.hours}</td>
                <td className="text-center">${service.rate.toFixed(2)}</td>
                <td className="text-center">${service.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <footer style={{ marginTop: "20px", textAlign: "right" }}>
          <p style={{ color: "#4A4E69" }}>
            Total Amount: $
            {props.services
              .reduce((sum, service) => sum + service.total, 0)
              .toFixed(2)}
          </p>
        </footer>
      </div>
    ),
  },
  bold: {
    name: "Bold & Vibrant",
    colors: {
      primary: "#FF5733", // Bright Orange
      secondary: "#FFC300", // Yellow
      background: "#FFFFFF", // White
      text: "#000000", // Black
      accent: "#33FF57", // Neon Green
    },
    typography: {
      header: "'Roboto', sans-serif",
      body: "'Nunito', sans-serif",
    },
    layout: "dynamic-grid",
    preview: (props) => (
      <div
        style={{
          fontFamily: "'Roboto', sans-serif",
          color: "#000000",
          backgroundColor: "#FFFFFF",
          padding: "20px",
        }}
      >
        <header
          style={{
            backgroundColor: "#FF5733",
            padding: "15px",
            color: "#FFFFFF",
            textAlign: "center",
          }}
        >
          <h1>Invoice #{props.invoiceNumber}</h1>
        </header>
        <main
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <section>
            <h3>Client Info:</h3>
            <p>{props.clientName}</p>
            <p>{props.clientEmail}</p>
            <p>{props.clientAddress}</p>
          </section>
          <section>
            <h3>Invoice Summary:</h3>
            <p>
              <strong>Issue Date:</strong> {props.createdAt.toDateString()}
            </p>
            <p>
              <strong>Due Date:</strong> {props.dueDate.toDateString()}
            </p>
          </section>
        </main>
        <table
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#FFC300", color: "#000000" }}>
              <th className="text-left">Title</th>
              <th className="text-left">Description</th>
              <th className="text-center">Hours</th>
              <th className="text-center">Rate</th>
              <th className="text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {props.services.map((service, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #33FF57" }}>
                <td>{service.title}</td>
                <td className="w-[500px]">{service.description}</td>
                <td className="text-center">{service.hours}</td>
                <td className="text-center">${service.rate.toFixed(2)}</td>
                <td className="text-center">${service.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <footer
          style={{
            marginTop: "20px",
            textAlign: "center",
            backgroundColor: "#33FF57",
            padding: "10px",
            color: "#000000",
          }}
        >
          Thank you for choosing us!
        </footer>
      </div>
    ),
  },
  retro: {
    name: "Retro Vintage",
    colors: {
      primary: "#8B4513", // Saddle Brown
      secondary: "#D2B48C", // Tan
      background: "#F5F5DC", // Beige
      text: "#555555", // Dark Gray
      accent: "#CD853F", // Peru
    },
    typography: {
      header: "'Bebas Neue', cursive",
      body: "'Courier Prime', monospace",
    },
    layout: "vintage-styled",
    preview: (props) => (
      <div
        style={{
          fontFamily: "'Courier Prime', monospace",
          color: "#555555",
          backgroundColor: "#F5F5DC",
          padding: "20px",
        }}
      >
        <header style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1
            style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: "48px",
              color: "#8B4513",
            }}
          >
            INVOICE
          </h1>
          <p>#{props.invoiceNumber}</p>
        </header>
        <main>
          <section>
            <h3>To:</h3>
            <p>{props.clientName}</p>
            <p>{props.clientEmail}</p>
            <p>{props.clientAddress}</p>
          </section>
          <section>
            <h3>Details:</h3>
            <p>
              <strong>Date:</strong> {props.createdAt.toDateString()}
            </p>
            <p>
              <strong>Due Date:</strong> {props.dueDate.toDateString()}
            </p>
          </section>
        </main>
        <table
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#D2B48C", color: "#555555" }}>
              <th className="text-left">Title</th>
              <th className="text-left">Description</th>
              <th className="text-center">Hours</th>
              <th className="text-center">Rate</th>
              <th className="text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {props.services.map((service, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #CD853F" }}>
                <td>{service.title}</td>
                <td className="w-[350px]">{service.description}</td>
                <td className="text-center">{service.hours}</td>
                <td className="text-center">${Number(service.rate).toFixed(2)}</td>
                <td className="text-center">${Number(service.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <footer
          style={{
            marginTop: "20px",
            textAlign: "center",
            backgroundColor: "#CD853F",
            padding: "10px",
            color: "#FFFFFF",
          }}
        >
          Thank you for your trust!
        </footer>
      </div>
    ),
  },
  futuristic: {
    name: "Futuristic Tech",
    colors: {
      primary: "#0F4C81", // Deep Blue
      secondary: "#1E90FF", // Dodger Blue
      background: "#000000", // Black
      text: "#FFFFFF", // White
      accent: "#00FFFF", // Cyan
    },
    typography: {
      header: "'Orbitron', sans-serif",
      body: "'Source Code Pro', monospace",
    },
    layout: "futuristic-dashboard",
    preview: (props) => (
      <div
        style={{
          fontFamily: "'Source Code Pro', monospace",
          color: "#FFFFFF",
          backgroundColor: "#000000",
          padding: "20px",
        }}
      >
        <header style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "36px",
              color: "#0F4C81",
            }}
          >
            INVOICE
          </h1>
          <p>#{props.invoiceNumber}</p>
        </header>
        <main>
          <section>
            <h3>Client:</h3>
            <p>{props.clientName}</p>
            <p>{props.clientEmail}</p>
            <p>{props.clientAddress}</p>
          </section>
          <section>
            <h3>Details:</h3>
            <p>
              <strong>Date:</strong> {props.createdAt.toDateString()}
            </p>
            <p>
              <strong>Due Date:</strong> {props.dueDate.toDateString()}
            </p>
          </section>
        </main>
        <table
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#1E90FF", color: "#000000" }}>
              <th>Title</th>
              <th>Description</th>
              <th>Hours</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {props.services.map((service, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #00FFFF" }}>
                <td>{service.title}</td>
                <td>{service.description}</td>
                <td>{service.hours}</td>
                <td>${Number(service.rate).toFixed(2)}</td>
                <td>${Number(service.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <footer
          style={{
            marginTop: "20px",
            textAlign: "center",
            backgroundColor: "#00FFFF",
            padding: "10px",
            color: "#000000",
          }}
        >
          Thank you for trusting our technology!
        </footer>
      </div>
    ),
  },
};

export type TemplateId = keyof typeof invoiceTemplates;

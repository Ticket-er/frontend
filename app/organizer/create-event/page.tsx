"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useCreateEvent } from "@/services/events/events.queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Upload, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

// Zod Schema
const createEventSchema = z.object({
  name: z.string().min(3, "Event name is required"),
  description: z.string().min(10, "Description is required"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(3, "Location is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  price: z.coerce.number().min(0, "Price is required"),
  quantity: z.coerce.number().min(1, "Total tickets is required"),
  banner: z
    .any()
    .refine(
      (file) => !file || file.size <= 10 * 1024 * 1024,
      "File size must be ≤10MB"
    )
    .refine(
      (file) => !file || ["image/png", "image/jpeg"].includes(file.type),
      "File must be PNG or JPG"
    )
    .optional(),
});

type CreateEventForm = z.infer<typeof createEventSchema>;

export default function CreateEventPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutateAsync: createEvent, isPending } = useCreateEvent();
  const { isLoading, user: currentUser } = useAuth();
  const router = useRouter();
  const categories = [
    "Music",
    "Concert",
    "Conference",
    "Workshop",
    "Sports",
    "Comedy",
    "Theatre",
    "Festival",
    "Exhibition",
    "Religion",
    "Networking",
    "Tech",
    "Fashion",
    "Party",
  ];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateEventForm>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      location: "",
      date: "",
      time: "",
      price: 0,
      quantity: 1,
      banner: undefined,
    },
  });

  useEffect(() => {
    if (!currentUser && !isLoading) {
      router.push(
        `/login?returnUrl=${encodeURIComponent(window.location.href)}`
      );
      return;
    }
    if (currentUser && !["ORGANIZER"].includes(currentUser.role)) {
      router.push("/explore");
      return;
    }
  }, [currentUser, router]);

  const previewUrl = watch("banner")
    ? URL.createObjectURL(watch("banner"))
    : null;

  const canProceedStep1 = watch("name") && watch("description");
  const canProceedStep2 =
    watch("location") &&
    watch("date") &&
    watch("time") &&
    watch("price") &&
    watch("quantity");

  const onSubmit = async (data: CreateEventForm) => {
    const fullDate = `${data.date}T${data.time}`;
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category.toUpperCase());
    formData.append("location", data.location);
    formData.append("date", fullDate);
    formData.append("price", data.price.toString());
    formData.append("maxTickets", data.quantity.toString());
    if (data.banner) {
      formData.append("file", data.banner);
    }

    try {
      await createEvent(formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Event creation failed:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setValue("banner", file);
  };

  const handleNext = () => {
    if (
      currentStep < 3 &&
      (currentStep === 1 ? canProceedStep1 : canProceedStep2)
    ) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateAnother = () => {
    reset();
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 bg-gray-50 bg-opacity-90 flex items-center justify-center z-50"
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Authentication...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your session
          </p>
        </div>
      </motion.div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Event Created!</h1>
          <p className="text-gray-600 mb-6">
            Your event "{watch("name")}" has been successfully created and is
            now live.
          </p>
          <div className="space-y-3">
            <Button
              className="w-full bg-[#1E88E5] hover:bg-blue-500 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <Link href="/organizer">Go to Dashboard</Link>
            </Button>
            <Button
              className="w-full bg-[#1E88E5] hover:bg-blue-500 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleCreateAnother}
            >
              Create Another Event
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" className="bg-transparent" asChild>
            <Link href="/organizer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold">Create New Event</h1>
            <p className="text-gray-600">Step {currentStep} of 3</p>
          </div>
          <div className="w-32" /> {/* Spacer for alignment */}
        </div>

        {/* Progress Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Event Details</span>
            <span>Date & Pricing</span>
            <span>Review & Submit</span>
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl">
                {currentStep === 1 && "Event Details"}
                {currentStep === 2 && "Date & Pricing"}
                {currentStep === 3 && "Review & Submit"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} id="create-event-form">
                {/* Step 1: Event Details */}
                {currentStep === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Event Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter event name"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your event..."
                        className="min-h-[100px]"
                        {...register("description")}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-600">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {categories.map((category) => (
                          <Button
                            key={category}
                            type="button"
                            variant={
                              watch("category") === category
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => setValue("category", category)}
                            className={
                              watch("category") === category
                                ? "bg-[#1E88E5] hover:bg-blue-500 text-white"
                                : "bg-transparent"
                            }
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                      {errors.category && (
                        <p className="text-sm text-red-600">
                          {errors.category.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Event Banner</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Banner preview"
                            className="mx-auto max-h-32 object-contain mb-2"
                          />
                        ) : (
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        )}
                        <p className="text-sm text-gray-600 mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 10MB
                        </p>
                        <input
                          type="file"
                          id="banner"
                          accept="image/png,image/jpeg"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 bg-transparent"
                          onClick={() =>
                            document.getElementById("banner")?.click()
                          }
                        >
                          Choose File
                        </Button>
                      </div>
                      {errors.banner && (
                        <p className="text-sm text-red-600">
                          {typeof errors.banner?.message === "string"
                            ? errors.banner.message
                            : null}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Step 2: Date & Pricing */}
                {currentStep === 2 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        placeholder="Enter event location"
                        {...register("location")}
                      />
                      {errors.location && (
                        <p className="text-sm text-red-600">
                          {errors.location.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input id="date" type="date" {...register("date")} />
                        {errors.date && (
                          <p className="text-sm text-red-600">
                            {errors.date.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Time *</Label>
                        <Input id="time" type="time" {...register("time")} />
                        {errors.time && (
                          <p className="text-sm text-red-600">
                            {errors.time.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Ticket Price (₦) *</Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="0 for free events"
                          {...register("price")}
                          min="0"
                          step="100"
                        />
                        <p className="text-xs text-gray-500">
                          Set to 0 for free events
                        </p>
                        {errors.price && (
                          <p className="text-sm text-red-600">
                            {errors.price.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Total Tickets *</Label>
                        <Input
                          id="quantity"
                          type="number"
                          placeholder="Number of tickets"
                          {...register("quantity")}
                          min="1"
                        />
                        {errors.quantity && (
                          <p className="text-sm text-red-600">
                            {errors.quantity.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {watch("price") > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Pricing Breakdown
                        </h4>
                        <div className="space-y-1 text-sm text-blue-800">
                          <div className="flex justify-between">
                            <span>Ticket Price:</span>
                            <span>₦{watch("price").toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Platform Fee (5%):</span>
                            <span>
                              ₦
                              {Math.round(
                                watch("price") * 0.05
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between font-medium border-t border-blue-300 pt-1">
                            <span>You receive per ticket:</span>
                            <span>
                              ₦
                              {Math.round(
                                watch("price") * 0.95
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Step 3: Review */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold">Event Details</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">Name:</span>
                            <p className="font-medium">{watch("name")}</p>
                          </div>
                          {/* <div>
                            <span className="text-gray-600">Category:</span>
                            <p className="font-medium">{watch("category")}</p>
                          </div> */}
                          <div>
                            <span className="text-gray-600">Description:</span>
                            <p className="font-medium line-clamp-3">
                              {watch("description")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold">Date & Pricing</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">Location:</span>
                            <p className="font-medium">{watch("location")}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Date & Time:</span>
                            <p className="font-medium">
                              {watch("date") &&
                                new Date(
                                  watch("date")
                                ).toLocaleDateString()}{" "}
                              at {watch("time")}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Price:</span>
                            <p className="font-medium">
                              {watch("price") === 0
                                ? "Free"
                                : `₦${watch("price").toLocaleString()}`}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              Total Tickets:
                            </span>
                            <p className="font-medium">{watch("quantity")}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {previewUrl && (
                      <div>
                        <h3 className="font-semibold mb-2">Banner Preview</h3>
                        <img
                          src={previewUrl}
                          alt="Banner preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {watch("price") > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-2">
                          Revenue Projection
                        </h4>
                        <div className="space-y-1 text-sm text-green-800">
                          <div className="flex justify-between">
                            <span>If all tickets sell:</span>
                            <span className="font-medium">
                              ₦
                              {(
                                watch("price") *
                                watch("quantity") *
                                0.95
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    className="bg-transparent"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < 3 ? (
                    <Button
                      className="bg-[#1E88E5] hover:bg-blue-500 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={handleNext}
                      disabled={
                        currentStep === 1 ? !canProceedStep1 : !canProceedStep2
                      }
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      form="create-event-form"
                      className="bg-[#1E88E5] hover:bg-blue-500 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isPending}
                    >
                      {isPending ? "Creating..." : "Create Event"}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

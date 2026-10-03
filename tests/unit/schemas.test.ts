import { describe, it, expect } from "vitest";
import {
  doctorCreateSchema,
  settingsUpdateSchema,
  appointmentStatusSchema,
  galleryCreateSchema,
  reviewUpdateSchema,
} from "@/lib/api/schemas";

describe("doctorCreateSchema", () => {
  const valid = {
    name: "Dr A",
    qualification: "MBBS",
    specialization: "Pediatrics",
    experience: 10,
    description: "x",
    consultingTime: "9-5",
    phone: "123",
  };

  it("accepts a complete doctor and strips unknown keys", () => {
    const out = doctorCreateSchema.parse({ ...valid, _id: "evil", isSuperAdmin: true });
    expect("_id" in out).toBe(false);
    expect("isSuperAdmin" in out).toBe(false);
    expect(out.name).toBe("Dr A");
  });

  it("rejects a missing required field", () => {
    const { name, ...rest } = valid;
    expect(doctorCreateSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects an invalid availability enum", () => {
    expect(doctorCreateSchema.safeParse({ ...valid, availability: "Vacationing" }).success).toBe(
      false
    );
  });
});

describe("settingsUpdateSchema", () => {
  it("strips internal/unknown fields (mass-assignment guard)", () => {
    const out = settingsUpdateSchema.parse({
      clinicName: "Murugan Physio",
      _id: "x",
      __v: 5,
      createdAt: "now",
      role: "admin",
    });
    expect(out).toEqual({ clinicName: "Murugan Physio" });
  });

  it("accepts heroMobileImages as objects or strings", () => {
    const out = settingsUpdateSchema.parse({
      heroMobileImages: [
        { imageUrl: "https://example.com/1.jpg", caption: "Therapy" },
        "https://example.com/2.jpg",
      ],
    });
    expect(out.heroMobileImages).toEqual([
      { imageUrl: "https://example.com/1.jpg", caption: "Therapy" },
      { imageUrl: "https://example.com/2.jpg", caption: "" },
    ]);
  });
});

describe("appointmentStatusSchema", () => {
  it("accepts allowed statuses, rejects others", () => {
    expect(appointmentStatusSchema.safeParse({ status: "Confirmed" }).success).toBe(true);
    expect(appointmentStatusSchema.safeParse({ status: "Deleted" }).success).toBe(false);
  });
});

describe("galleryCreateSchema", () => {
  it("requires imageUrl and category", () => {
    expect(galleryCreateSchema.safeParse({ imageUrl: "u", category: "gallery" }).success).toBe(true);
    expect(galleryCreateSchema.safeParse({ category: "gallery" }).success).toBe(false);
  });
});

describe("reviewUpdateSchema", () => {
  it("clamps rating range", () => {
    expect(reviewUpdateSchema.safeParse({ rating: 5 }).success).toBe(true);
    expect(reviewUpdateSchema.safeParse({ rating: 9 }).success).toBe(false);
  });
});

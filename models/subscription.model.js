import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a subscription name"],
      trim: true,
      minLength: [2, "Name must be at least 2 characters"],
      maxLength: [100, "Name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a subscription price"],
      min: [0, "Price must be greater than 0"],
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP"],
      default: "USD",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      enum: [
        "sports",
        "news",
        "politics",
        "entertainment",
        "lifestyle",
        "technology",
        "finance",
        "other",
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
    },
    startDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value >= new Date();
        },
        message: "Start date must be in the past",
      },
    },
    renewalDate: {
      type: Date(),
      validate: {
        validator: function (value) {
          return value >= this.startDate;
        },
        message: "Renewal date must be after the start date",
      },
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency]
    );
  }
  // Auto-update the status if renewal date has passed
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }
  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;

import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { amount, currency, courseId, levelId } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ error: "Missing required payment details." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: courseId ? `Course ${courseId}` : `Level ${levelId}`,
            },
            unit_amount: amount * 100, 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://yourdomain.com/success", 
      cancel_url: "https://yourdomain.com/cancel", 
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: "Failed to create checkout session." });
  }
};

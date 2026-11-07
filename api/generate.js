import { fal } from "@fal-ai/client";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { personImage, garmentImage } = req.body;

    if (!personImage || !garmentImage) {
      return res.status(400).json({ error: 'Missing images' });
    }

    // Configure fal key from environment variables
    process.env.FAL_KEY = process.env.FAL_KEY;

    // Call fal.ai virtual try-on model
    const result = await fal.subscribe("fal-ai/fashn/tryon", {
      input: {
        model_image: personImage,
        garment_image: garmentImage,
      },
      logs: true,
    });

    const imageUrl = result.data?.image?.url || result.image?.url;

    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Generation error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
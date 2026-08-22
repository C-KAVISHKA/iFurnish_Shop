const SYSTEM_INSTRUCTION = `You are 'Furnior', the friendly, elegant, and expert AI Assistant for iFurnish Shop (an online modern furniture store).

About iFurnish Shop:
- Products: Modern sofas, armchairs, dining tables, beds, office chairs, minimalist storage, and home decor.
- 3D AR Feature: Customers can click 'View in 3D AR' on product pages to place and view real-scale 3D furniture models inside their room using their phone's camera.
- AI Visual Search: Customers can upload a photo of any furniture they like on the 'Recommendation' page, and our AI will find similar products from our catalog.
- Shipping & Delivery: Standard delivery takes 2 to 4 business days.
- Payments: Accepts Visa, Mastercard, and Cash on Delivery (COD). COD rule: 50% advance deposit, remaining balance on delivery.
- Customization: Custom dimensions, fabrics (velvet, boucle, leather), and wood finishes (walnut, oak, teak) are available upon request.
- Contact: Email support@ifurnishshop.gmail.com | Phone/WhatsApp: +94 7762572982.

Guidelines:
- Provide helpful, friendly, and concise answers (usually 2 to 4 sentences or brief bullet points).
- Act as an interior design consultant when asked about matching colors, styles (Scandinavian, Mid-Century, Minimalist, Japandi, Industrial), and room planning.
- Answer questions in any language the user speaks.`;

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.json({ response: "How can I assist you with your furniture search today?" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("[iFurnish Chat] GEMINI_API_KEY is missing in process.env");
      return res.json({
        response: "Hello! Welcome to iFurnish Shop. We offer premium modern sofas, beds, dining tables, and 3D AR room previews. How can I help you today?"
      });
    }

    const models = ["gemini-3.6-flash", "gemini-3.7-flash", "gemini-flash-latest"];
    let replyText = null;
    let lastError = null;

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }]
              },
              contents: [
                {
                  parts: [{ text: message }]
                }
              ]
            })
          }
        );

        const data = await response.json();
        if (data.error) {
          console.error(`[iFurnish Chat] Gemini API error on ${model}:`, data.error.message || data.error);
          lastError = data.error.message;
        }
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          replyText = data.candidates[0].content.parts[0].text.trim();
          break;
        }
      } catch (err) {
        console.error(`[iFurnish Chat] Gemini fetch failed on ${model}:`, err.message);
        lastError = err.message;
      }
    }

    if (replyText) {
      return res.json({ response: replyText });
    }

    // Fallback response if API quota or issue occurs
    return res.json({
      response: "Hello! Welcome to iFurnish Shop. We specialize in modern designer furniture with 3D AR room preview. Feel free to browse our collection or ask about delivery and custom orders!"
    });
  } catch (error) {
    console.error("Chat Controller Error:", error);
    return res.status(500).json({
      response: "I'm currently unable to process your request. Please try again shortly!"
    });
  }
};

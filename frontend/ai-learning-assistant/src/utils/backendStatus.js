const API_URL = import.meta.env.VITE_API_URL;

export const waitForBackend = async () => {
  const maxRetries = 30;

  if (!API_URL) {
    console.error("VITE_API_URL is not defined");
    return false;
  }

  for (let i = 0; i < maxRetries; i++) {
    const controller = new AbortController();

    // Give each request a maximum of 5 seconds
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(`${API_URL}/health`, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        console.log("Backend is connected");
        return true;
      }
    } catch (err) {
      clearTimeout(timeout);
      console.log(`Backend waking up... Attempt ${i + 1}/${maxRetries}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return false;
};
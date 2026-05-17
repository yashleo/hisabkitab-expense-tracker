export default function PrivacyPolicyPage() {
  return (
    <main style={{
      maxWidth: "800px",
      margin: "40px auto",
      padding: "24px",
      fontFamily: "system-ui, sans-serif",
      lineHeight: "1.6"
    }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        Privacy Policy
      </h1>

      <p>
        This WhatsApp bot collects and processes messages only to provide automated responses.
      </p>

      <p>
        We do not sell, share, or misuse user data.
      </p>

      <p>
        Messages sent to this bot may be processed via third-party services like Meta (WhatsApp Cloud API) and automation tools such as n8n.
      </p>

      <p>
        No personal data is stored permanently unless required for functionality.
      </p>

      <p>
        For any concerns, contact: your-email@example.com
      </p>
    </main>
  );
}

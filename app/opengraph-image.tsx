import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const alt = "Tom Hunter — Producer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const fontData = fs.readFileSync(
    path.join(process.cwd(), "public/fonts/403Code-Fuzz-Regular.otf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#EFEAE0",
          color: "#0F0E0C",
          fontFamily: "Fuzz",
        }}
      >
        <div
          style={{
            fontSize: 200,
            letterSpacing: -8,
            textTransform: "uppercase",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          Tom Hunter
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Fuzz",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}

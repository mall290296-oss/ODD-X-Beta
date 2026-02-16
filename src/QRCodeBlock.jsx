import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeBlock() {
  // URL vers laquelle pointe le QR code
  const targetURL = "https://ton-site.vercel.app";

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-slate-700">
        Accéder au questionnaire
      </h2>

      <QRCodeCanvas
        value={targetURL}
        size={180}
        bgColor="#ffffff"
        fgColor="#0f172a"
        level="H"
        includeMargin={true}
      />

      <p className="text-sm text-slate-500 text-center">
        Scannez ce QR code pour ouvrir le diagnostic ODD
      </p>
    </div>
  );
}
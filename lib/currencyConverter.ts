export async function convertModalToIDR(
  modal: number,
  modalType: "usc" | "usd" | "idr"
): Promise<number> {

  if (!modal || isNaN(modal)) {
    return 0;
  }

  // Normalisasi ke USD
  let usdValue = 0;

  switch (modalType) {
    case "usc": // cent → USD
      usdValue = modal / 100;
      break;

    case "usd":
      usdValue = modal;
      break;

    case "idr":
      return modal; // sudah IDR
  }

  // Ambil kurs USD → IDR
  const res = await fetch(
    "https://api.frankfurter.app/latest?from=USD&to=IDR"
  );

  if (!res.ok) throw new Error("Failed to fetch exchange rate");

  const data = await res.json();
  const rate = Number(data?.rates?.IDR);

  if (!rate || isNaN(rate)) throw new Error("Invalid IDR conversion rate");

  // Konversi USD → IDR
  return usdValue * rate;
}

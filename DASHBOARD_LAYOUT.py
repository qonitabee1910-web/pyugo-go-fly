#!/usr/bin/env python3
"""
PYU-GO Dashboard - Mobile Layout Visualization
Shows the mobile-first layout structure
"""

DASHBOARD_LAYOUT = """
╔════════════════════════════════════════╗
║          DASHBOARD MOBILE VIEW         ║
╠════════════════════════════════════════╣
║                                        ║
║  [≡] PYU-GO    🔔(1)  [☰]  [👤]       ║ ← DashboardHeader
║                                        ║
╠════════════════════════════════════════╣
║                                        ║
║  Selamat datang, User!                 ║
║  Apa yang ingin kamu lakukan?          ║
║                                        ║
╠════════════════════════════════════════╣
║                                        ║
║  ┌──────────────┐  ┌──────────────┐   ║
║  │  🚗 Naik     │  │ 🚌 Shuttle   │   ║
║  │  Pesan       │  │ Bus dan      │   ║ ← QuickServices
║  │  perjalanan  │  │ shuttle      │   ║
║  └──────────────┘  └──────────────┘   ║
║                                        ║
║  ┌──────────────┐  ┌──────────────┐   ║
║  │ 🏨 Hotel     │  │  ❓ Bantuan   │   ║
║  │ Pesan        │  │ Hubungi      │   ║
║  │ penginapan   │  │ support      │   ║
║  └──────────────┘  └──────────────┘   ║
║                                        ║
║  ┌────────────────────────────────┐   ║
║  │ 🎁 Kupon Diskon               │   ║
║  │ Klaim reward Anda sekarang  ➜  │   ║
║  └────────────────────────────────┘   ║
║                                        ║
╠════════════════════════════════════════╣
║                                        ║
║  ┌────────────────────────────────┐   ║
║  │ 💳 Dompet PYU-GO      [Aktif]  │   ║
║  │                                │   ║
║  │ Saldo Anda                     │   ║
║  │ Rp 250.000                     │   ║
║  │                                │   ║ ← WalletCard
║  │ [Top Up]          [Kirim]      │   ║
║  │                                │   ║
║  │ Transaksi bulan ini: Rp 2.5M   │   ║
║  └────────────────────────────────┘   ║
║                                        ║
╠════════════════════════════════════════╣
║                                        ║
║  Pesanan Terbaru                       ║
║  [Lihat Semua →]                       ║
║                                        ║
║  ┌────────────────────────────────┐   ║
║  │ 🚗 Perjalanan ke Kota          │   ║
║  │ Jl. Sudirman → Jl. Gatot S.   │   ║
║  │ ⏰ 2 jam yang lalu              │   ║
║  │ Rp 45.000  [Selesai]       ➜   │   ║ ← RecentBookings
║  └────────────────────────────────┘   ║
║                                        ║
║  ┌────────────────────────────────┐   ║
║  │ 🚌 Shuttle Bandara             │   ║
║  │ Terminal → Bandara S.H.        │   ║
║  │ ⏰ Kemarin                      │   ║
║  │ Rp 75.000  [Selesai]       ➜   │   ║
║  └────────────────────────────────┘   ║
║                                        ║
║  ┌────────────────────────────────┐   ║
║  │ 🚗 Perjalanan ke Kantor        │   ║
║  │ Rumah → Kantor                 │   ║
║  │ ⏰ 3 hari yang lalu             │   ║
║  │ Rp 52.000  [Selesai]       ➜   │   ║
║  └────────────────────────────────┘   ║
║                                        ║
╠════════════════════════════════════════╣
║                                        ║
║  ┌────────────────────────────────┐   ║
║  │ 🎉 Promo Spesial Bulan Ini    │   ║
║  │                                │   ║
║  │ Dapatkan diskon hingga 50%    │   ║
║  │ untuk pesanan pertama Anda!   │   ║
║  │                                │   ║
║  │ [Lihat Promo]                  │   ║
║  └────────────────────────────────┘   ║
║                                        ║
║ (Scrollable area ends here)            ║
║ (Content padding for navbar)           ║
║                                        ║
╠════════════════════════════════════════╣
║ Shuttle | Ride | Pesanan | Promo | ⋯ ║ ← Fixed Navbar
╚════════════════════════════════════════╝

SIDEBAR MENU (When ☰ button clicked):
╔════════════════════════════════════════╗
║ Menu                             [✕]   ║
╠════════════════════════════════════════╣
║                                        ║
║  👤  User Name                         ║
║     user@example.com                   ║
║  [Edit Profil]                         ║
║                                        ║
╠════════════════════════════════════════╣
║                                        ║
║  👤 Profil Saya                        ║
║  💳 Pembayaran                         ║
║  📍 Alamat Tersimpan                   ║
║  ❤️  Favorit                           ║
║  ⚙️  Pengaturan                        ║
║  ❓ Bantuan & FAQ                      ║
║  📄 Ketentuan Layanan                  ║
║                                        ║
╠════════════════════════════════════════╣
║                                        ║
║  🚪 Keluar                             ║
║                                        ║
╠════════════════════════════════════════╣
║  Versi 1.0.0                           ║
║  © 2026 PYU-GO Super App               ║
╚════════════════════════════════════════╝
"""

# Colors used in design (Tailwind CSS)
COLORS = {
    "primary_blue": "from-blue-500 to-blue-600",
    "primary_dark_blue": "from-blue-600 to-blue-700",
    "purple": "from-purple-500 to-purple-600",
    "amber": "from-amber-500 to-amber-600",
    "green": "from-green-500 to-green-600",
    "red": "from-red-500 to-red-600",
    "gray": {
        "50": "#f9fafb",
        "100": "#f3f4f6",
        "500": "#6b7280",
        "600": "#4b5563",
        "900": "#111827",
    }
}

# Typography
TYPOGRAPHY = {
    "heading_2xl": {"size": "1.5rem", "weight": "bold", "class": "text-2xl font-bold"},
    "heading_lg": {"size": "1.125rem", "weight": "semibold", "class": "text-lg font-semibold"},
    "heading_sm": {"size": "0.875rem", "weight": "semibold", "class": "text-sm font-semibold"},
    "body_sm": {"size": "0.875rem", "weight": "regular", "class": "text-sm"},
    "body_xs": {"size": "0.75rem", "weight": "regular", "class": "text-xs"},
}

# Spacing scale (Tailwind)
SPACING = {
    "px_2": "0.5rem",
    "px_3": "0.75rem",
    "px_4": "1rem",
    "px_6": "1.5rem",
    "py_2": "0.5rem",
    "py_3": "0.75rem",
    "py_4": "1rem",
    "py_6": "1.5rem",
    "gap_2": "0.5rem",
    "gap_3": "0.75rem",
    "gap_4": "1rem",
}

# Breakpoints (Mobile-first)
BREAKPOINTS = {
    "mobile": "375px",      # iPhone SE, smallest modern phone
    "mobile_lg": "425px",   # iPhone 13 mini
    "tablet": "768px",      # iPad
    "desktop": "1024px",    # MacBook
}

# Component dimensions (Touch targets)
TOUCH_TARGETS = {
    "button": "44x44px",    # Minimum button size
    "service_card": "64x64px",
    "menu_item": "48px height",
    "avatar": "40-48px diameter",
}

# Layout metrics
LAYOUT = {
    "header_height": "64px",
    "navbar_height": "64px",
    "content_padding": "1rem (px-4)",
    "section_padding": "1.5rem (py-6)",
    "card_border_radius": "0.75rem (rounded-xl)",
}

if __name__ == "__main__":
    print(DASHBOARD_LAYOUT)
    print("\n📐 LAYOUT METRICS\n")
    print(f"Header Height: {LAYOUT['header_height']}")
    print(f"Navbar Height: {LAYOUT['navbar_height']}")
    print(f"Content Padding: {LAYOUT['content_padding']}")
    print(f"Section Padding: {LAYOUT['section_padding']}")
    print(f"\n📱 BREAKPOINTS\n")
    for device, size in BREAKPOINTS.items():
        print(f"{device.title()}: {size}")
    print(f"\n✋ TOUCH TARGETS\n")
    for element, size in TOUCH_TARGETS.items():
        print(f"{element.title()}: {size}")

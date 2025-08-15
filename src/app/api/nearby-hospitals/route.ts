// src/app/api/nearby-hospitals/route.ts
// import { NextResponse } from 'next/server';

// const mockHospitalData = {
//   Karnataka: [
//     {
//       name: "Manipal Hospital",
//       contact: "+91 80 2222 1111",
//       address: "98, HAL Old Airport Rd, Bengaluru, Karnataka 560017"
//     },
//     {
//       name: "Narayana Health City",
//       contact: "+91 80 7122 2222",
//       address: "258/A, Bommasandra Industrial Area, Bengaluru, Karnataka 560099"
//     },
//     {
//       name: "Victoria Hospital",
//       contact: "+91 80 2670 1150",
//       address: "Fort Rd, New Tharagupet, Bengaluru, Karnataka 560002"
//     }
//   ],
//   Maharashtra: [
//     {
//       name: "Lilavati Hospital",
//       contact: "+91 22 2656 7777",
//       address: "A-791, Bandra Reclamation, Mumbai, Maharashtra 400050"
//     },
//     {
//       name: "KEM Hospital",
//       contact: "+91 22 2410 7000",
//       address: "Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012"
//     }
//   ],
//   TamilNadu: [
//     {
//       name: "Apollo Hospital",
//       contact: "+91 44 2829 3333",
//       address: "21, Greams Lane, Off Greams Road, Chennai, Tamil Nadu 600006"
//     }
//   ]
// };

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const state = searchParams.get('state')?.trim();

//   if (!state) {
//     return NextResponse.json({ error: "Missing 'state' parameter." }, { status: 400 });
//   }

//   const hospitals = mockHospitalData[state as keyof typeof mockHospitalData];

//   if (!hospitals) {
//     return NextResponse.json({ error: `No hospitals found for state '${state}'.` }, { status: 404 });
//   }

//   return NextResponse.json({ state, hospitals });
// }



import 'server-only';

// src/app/api/nearby-hospitals/route.ts
import { NextResponse } from 'next/server';

const API_KEY = process.env.API_SETU_KEY; // Replace with your actual API Key

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state')?.trim();

  if (!state) {
    return NextResponse.json({ error: "Missing 'state' parameter." }, { status: 400 });
  }

  try {
    const url = `https://api.data.gov.in/resource/98fa254e-c5f8-4910-a19b-4828939b477d?api-key=${API_KEY}&format=json&filters[state]=${encodeURIComponent(state)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.records || data.records.length === 0) {
return NextResponse.json({ hospitals: [], message: `No hospital records found for "${state}".` }, { status: 200 });
    }

    // Clean and return the response
    const hospitals = data.records.map((record: any) => ({
      name: record.hospital_name,
      contact: record.emergency_number || record.mobile || record.telephone || "N/A",
      address: `${record.address || ""}, ${record.district || ""}, ${record.state || ""}, PIN: ${record.pincode || ""}`,
    }));

    return NextResponse.json({ state, hospitals });

  } catch (error) {
    console.error("Error fetching from OGD API:", error);
    return NextResponse.json({ error: "Failed to fetch hospital data." }, { status: 500 });
  }
}

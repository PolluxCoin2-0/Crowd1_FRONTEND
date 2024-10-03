const ReferralEarning = () => {
    const dummyData = [
      {
        level: "1",
        totalWallets: "50",
        totalInvestments: "$10,000",
        totalEarnings: "$1,500",
      },
      {
        level: "2",
        totalWallets: "30",
        totalInvestments: "$6,000",
        totalEarnings: "$900",
      },
      {
        level: "3",
        totalWallets: "20",
        totalInvestments: "$4,000",
        totalEarnings: "$600",
      },
    ];
  
    return (
      <div className="min-h-screen bg-[#0E0E0E] text-white ">
        {/* Navbar */}
        <nav className="bg-[#151515] p-6 text-center mb-6"
          style={{
            boxShadow: `
              0 0px 25px rgba(0, 0, 0, 0.6)
            `,
          }}
        >
          <p className="text-lg font-bold">Crowd1.com</p>
        </nav>
  
        {/* Table Section */}
        <div className="overflow-x-auto py-6 px-4 2xl:px-32">
          <table className="min-w-full  text-gray-300 rounded-lg shadow-lg">
            <thead>
              <tr className="text-left text-sm uppercase border-b border-gray-700">
                <th className="py-4 px-6">Level</th>
                <th className="py-4 px-6 text-center">Total Wallets</th>
                <th className="py-4 px-6 text-center">Total Investments</th>
                <th className="py-4 px-6 text-right">Total Earnings</th>
              </tr>
            </thead>
            <tbody>
              {dummyData.map((data, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-700 hover:bg-gray-800 transition-all ${index === dummyData.length - 1 ? 'last:border-0' : ''}`}
                >
                  <td className="py-4 px-6">{data.level}</td>
                  <td className="py-4 px-6 text-center">{data.totalWallets}</td>
                  <td className="py-4 px-6 text-center">{data.totalInvestments}</td>
                  <td className="py-4 px-6 text-right">{data.totalEarnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default ReferralEarning;
  
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Bs.css';

const Bs = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const getreq = async () => {
    try {
      const response = await fetch('https://server-ufa1.onrender.com/balancesheet');
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const json = await response.json();

      // Combine credit and debit with side info
      const combined = [
        ...(json.credit || []).map(item => ({
          ...item,
          side: 'left',
          netamt: Number(item.netamt),
          isTallied: item.star === "⭐"
        })),
        ...(json.debit || []).map(item => ({
          ...item,
          side: 'right',
          netamt: Number(item.netamt),
          isTallied: item.star === "⭐"
        }))
      ];

      console.log("Combined data:", combined);
      setData(combined);

    } catch (err) {
      console.error('Error fetching balance sheet:', err);
    }
  };

  useEffect(() => {
    getreq();
  }, []);

  const gotonext = (fparty) => {
    navigate(`/settlingentry?fparty=${encodeURIComponent(fparty)}`);
  };

  // Totals
  const leftTotal = data.filter(item => item.side === 'left')
                        .reduce((acc, item) => acc + item.netamt, 0);
  const rightTotal = data.filter(item => item.side === 'right')
                         .reduce((acc, item) => acc + item.netamt, 0);

  const printBalance = () => alert("Print working");

  return (
    <>
      <div className="bs-container">Balance Sheet</div>

      <div className="both_s_contain">

        {/* LEFT SIDE */}
        <div className="data_left">
          <div className="column-heading">
            <span>Party Name</span>
            <span>Amount</span>
            <span>Tally</span>
          </div>
          <ul>
            {data.filter(item => item.side === 'left').map((item, index) => (
              <li key={index} className={`leftnames ${item.isTallied ? 'tallied' : ''}`}
                  onClick={() => gotonext(item.fparty)}>
                <span>{item.fparty}</span>
                <span>{item.netamt}</span>
                <span>{item.star ? '⭐' : ''}</span>
              </li>
            ))}
          </ul>
          {leftTotal > 0 && <div className="total" style={{ color: "blue" }}>Total: ₹{leftTotal}</div>}
        </div>

        {/* RIGHT SIDE */}
        <div className="data_right">
          <div className="column-heading">
            <span>Party Name</span>
            <span>Amount</span>
            <span>Tally</span>
          </div>
          <ul>
            {data.filter(item => item.side === 'right').map((item, index) => (
              <li key={index} className={`rightnames ${item.isTallied ? 'tallied' : ''}`}
                  onClick={() => gotonext(item.fparty)}>
                <span>{item.fparty}</span>
                <span>{item.netamt}</span>
                <span>{item.star ? '⭐' : ''}</span>
              </li>
            ))}
          </ul>
          {rightTotal < 0 && <div className="total" style={{ color: "red" }}>Total: ₹{rightTotal}</div>}
        </div>

      </div>

      <div className="buttons_section">
        <button>PendingTallyParty</button>
        <button onClick={printBalance}>PrintBalancesheet</button>
      </div>
    </>
  );
};

export default Bs;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Bs.css';

const Bs = () => {
  console.clear();
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const getreq = async () => {
    try {
      const response = await fetch('http://localhost:5000/balancesheet', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const json = await response.json();

        const combined = [
          ...json.leftData.map(item => ({ ...item, side: 'left' })),
          ...json.rightData.map(item => ({ ...item, side: 'right' })),
        ];
        setData(combined);
      } else {
        console.warn('Failed to fetch data:', response.status);
      }
    } catch (err) {
      console.error('Error fetching balance sheet: ' + err);
    }
  };

  useEffect(() => {
    getreq();
  }, []);

  const gotonext = (fparty) => {
    navigate(`/settlingentry?fparty=${encodeURIComponent(fparty)}`);
  };

  // ✅ Total calculations
  const leftTotal = data
    .filter(item => item.side === 'left')
    .reduce((acc, item) => acc + (parseFloat(item.netamt) || 0), 0);

  const rightTotal = data
    .filter(item => item.side === 'right')
    .reduce((acc, item) => acc + (parseFloat(item.netamt) || 0), 0);

  return (
    <>
      <div className="bs-container">Balance Sheet</div>

      <div className="both_s_contain">
        <div className='heading_container' id='heading_container' name='heading_container'></div>
        
        <div className="data_left">
         <div className="column-heading">
          <span>Party Name</span>
          <span>Amount</span>
        </div>
          <ul>
            {data
              .filter(item => item.side === 'left')
              .map((item, index) => (
                <li
                  className="leftnames"
                  key={index}
                  onClick={() => gotonext(item.fparty)}
                >
                  <span>{item.fparty}</span><span>{item.netamt}</span>
                </li>
              ))}
          </ul>
          <div className="total" id="total" name="total">Total: ₹{leftTotal}</div>
        </div>

        {/* RIGHT */}
        <div className="data_right">
        <div className="column-heading">
          <span>Party Name</span>
          <span>Amount</span>
        </div>
          <ul>
            {data
              .filter(item => item.side === 'right')
              .map((item, index) => (
                <li
                  className="rightnames"
                  key={index}
                  onClick={() => gotonext(item.fparty)}
                >
                  <span>{item.fparty}</span><span>{item.netamt}</span>
                </li>
              ))}
          </ul>
          <div className="total" id="total" name="total">Total: ₹{rightTotal}</div>
        </div>
      </div>
    </>
  );
};

export default Bs;

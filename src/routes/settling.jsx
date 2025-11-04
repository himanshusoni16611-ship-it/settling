import { useState, useEffect, useRef,useMemo } from 'react';
import Swal from 'sweetalert2';
import './Settling.css';
import { useParty } from '../Context/partycontext';
import Select from 'react-select';
import propercase from '../functions/function';
import {useLocation} from 'react-router-dom';


const SettlingEntry = () => {
  const { partyList } = useParty();
const [fparty, setFparty] = useState(''); // selected party name (string)
const [sparty, setSparty] = useState('');       // selected party name (string)
 const location = useLocation();
const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
// use state and all ref and memo are declard here
  const dateRef = useRef(null);
  const spartyRef = useRef(null);
  const debitref = useRef(null);
  const creditref = useRef(null);
  const narrattionref = useRef(null);
  const fpartyref = useRef(null);

 const [debit,setDebit] = useState('');
  const [credit,setCredit] = useState('');
  const [narration,setNarrattion] = useState('');
 
  const [latestEntryId, setLatestEntryId] = useState(null);
  const latestEntryRef = useRef(null);

  const [partyData, setPartyData] = useState([]);
const [up_id,setup_id] = useState();  
 const [isUpdating, setIsUpdating] = useState(false);

 function format_date(dateString) {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
}


useEffect(()=>{
  fpartyref.current?.focus();
const locationparan = new URLSearchParams(location.search);
const partyfrmqu = locationparan.get('fparty');
if(partyfrmqu){
  setFparty(partyfrmqu);
}  
},[]);

useEffect(() => {
  if (fparty.trim()) {
    fetchData(fparty);
  } else {
    setPartyData([]); // clear if no party
  }
}, [fparty]);


function focusnextInput(e, currentRef, nextRef) {
  const isSelectOpen = currentRef?.current?.state?.menuIsOpen;

  if (e.key === 'Enter' && !isSelectOpen) {
    e.preventDefault();
    nextRef?.current?.focus();
  }
}


//handledebitchange for check debit value
const handledebitcahange=(e)=>{
 const val = e.target.value;
  setDebit(val)
if(val && parseFloat(val)>0){
  setCredit('');
}
}
const handlecreditchange=(e)=>{
  const val = e.target.value;
  setCredit(val)
  if(val && parseFloat(val)>0){
    setDebit('');
  }
}

useEffect(() => {
  if (latestEntryRef.current) {
    latestEntryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.scrollBy({ top: 100, behavior: 'smooth' }); // still smooth, but instant after scrollIntoView

    // Focus immediately
    latestEntryRef.current.focus();
    dateRef.current?.focus(); // optional chaining in case ref is not ready
  }
}, [latestEntryId, partyData.length]);


const handleSubmit = async (e) => {
    e.preventDefault();

    const debitValue = parseFloat(debit) || '';
    const creditValue = parseFloat(credit) || '';

    const isDebitValid = !isNaN(debitValue) && debitValue > 0;
  const isCreditValid = !isNaN(creditValue) && creditValue > 0;

  if (isDebitValid && isCreditValid) {
    Swal.fire({
      text: 'Only one of Debit or Credit should have a value',
      icon: 'warning',
    });
    return fpartyref.current.focus();
  }

  if (!isDebitValid && !isCreditValid) {
    Swal.fire({
      text: 'Either Debit or Credit must have a value',
      icon: 'warning',
    });
    return;
  }

    const payload = {
      fparty,
      date,
      sparty,
      debit: debitValue,
      credit: creditValue,
      narration,
      tally: '',
    };

    if (up_id == null) {
      // Add new entry
      try {
        const response = await fetch('http://178.16.139.134:5000/settlingentry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (result.latestId) setLatestEntryId(result.latestId);
        await fetchData(payload.fparty);
        setDebit('');
        setCredit('');
        setNarrattion('');
      } catch (err) {
        console.error('Cannot post:', err);
      }
    } else {
      // Update existing entry
      try {
        const response = await fetch(`http://178.16.139.134:5000/settlingentry/${up_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Update failed');
        await fetchData(payload.fparty);
        setDebit('');
        setCredit('');
        setNarrattion('');
        setIsUpdating(false);
        setup_id(null);
        fpartyref.current.focus();
      } catch (err) {
        console.error('Update error:', err);
      }
    }
  };
///delete process entry//const is used for no one can change its value
const delete_entry = async (txtnId) => {

const deletepop = await Swal.fire({
title:"Are you Sure want to delete it",
icon:"warning",
showCancelButton:true,
confirmButtonText:'Yes,Delete this',
cancelButtonText:'Cancel'
})

if(deletepop.isConfirmed){
  try {
    const response = await fetch(`http://178.16.139.134:5000/settlingentry/${txtnId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Delete success:',txtnId);
      await fetchData(fparty); // Make sure this function exists and is async if needed
    
  } else {
      console.error('Delete failed:', result.message);
    }
  } catch (err) {
    console.error('Error during delete:', err); // ✅ fixed incorrect console.err
  }
};
}

//modify process entry its pending
const modify_entry = async (txtnId) => {
const modipop = await Swal.fire({
title:"Are you Sure want to Modify it",
icon:"warning",
showCancelButton:true,
confirmButtonText:'Yes,Modify this',
cancelButtonText:'Cancel'

})
if(modipop.isConfirmed){
  try {
    const response = await fetch(`http://178.16.139.134:5000/settlingentry/${txtnId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
     
      fillform(data);
             setIsUpdating(true);
             
    } else {
      console.error("Failed to fetch entry. Status:", response.status);
    }
  } catch (err) {
    console.error("Error fetching entry:", err);
  }
};
}
const fillform = (data) => {
 setup_id(data._id);                 // for tracking if it's an update
  setFparty(data.fparty);
  setSparty(data.sparty);
  setDate(data.date);
  setDebit(data.debit || '');
  setCredit(data.credit || '');
  setNarrattion(data.narration || '');
};

// my settling hovering through keydown
const handlerowkeydown = (e, index, txtnId) => {
  if (["ArrowDown", "ArrowUp", "Delete", "F2", "F3"].includes(e.key)) {
    e.preventDefault();
  }

  const rows = document.querySelectorAll('#sett_tbody tr');
  const rowCount = rows.length;
  if (rowCount === 0) return;

  if (e.key === "ArrowDown") {
    const nextIndex = (index + 1) < rowCount ? index + 1 : 0;
    const nextRow = rows[nextIndex];
    nextRow?.focus();
    nextRow?.scrollIntoView({ behavior: "smooth", block: "nearest" });

  } else if (e.key === "ArrowUp") {
    const previousIndex = index > 0 ? index - 1 : rowCount - 1;
    const prevRow = rows[previousIndex];
    prevRow?.focus();
    prevRow?.scrollIntoView({ behavior: "smooth", block: "nearest" });

  } else if (e.key === "Delete") {
    delete_entry(txtnId);

  } else if (e.key === "F2") {
    modify_entry(txtnId);

  } else if (e.key === "F3") {
    if (rowCount > 0) {
      const lastRow = rows[rowCount - 1];
      lastRow?.focus();
      lastRow?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }
};


//process tally
const Process_tally = async(e,fparty)=>{

  e.preventDefault();

const result = await Swal.fire({
  title:"Are you Sure Want to tally",
  icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, tally them!',
    cancelButtonText: 'Cancel'
});

if(!result.isConfirmed)return;
  try{
const response = await fetch(`http://178.16.139.134:5000/settlingentry/tally/${encodeURIComponent(fparty)}`,{
method:"POST",
headers:{
  'Content-Type':'application/json',
},
body:JSON.stringify({fparty}),

})
if(response.ok){
    await fetchData(fparty);
}
  }catch(error){
console.error('Tally error:',error);
  }
}



 //fetchdata by name
 const fetchData = async (party) => {
  if (!party || !party.trim()) {
    setPartyData([]);
    return;
  }

  try {
    const response = await fetch(`http://178.16.139.134:5000?fparty=${encodeURIComponent(party)}`,
  {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        setPartyData(data);
      }
    } else {
      setPartyData('Error fetching data');
    }
  } catch (err) {
    console.error('Fetch error:', err);
    setPartyData('Fetch failed');
  }
};

      
    //use memo is used for get data from memory

  let runBal = 0;
const closingBalance = useMemo(()=>{
  return partyData.reduce((acc,entry)=>{
    const dr = entry.debit||0;
    const cr = entry.credit||0;
    return acc+dr-cr;
  },0);
},[partyData]); 
  return (
    <form onSubmit={handleSubmit}>
 
<div className="myheading">
 <input
  type="hidden"
  className="up_id"
  id="up_id"
  name="up_id"
  value={up_id || ''}
/>

  <div className="input-row">
  <div className="input-group-row">
  PartyName
  <Select
    inputId="fparty"
    ref={fpartyref}
    options={partyList.map(p => {
      const pc = propercase(p.pnm);
      return { value: pc, label: pc };
    })}
    value={partyList
      .map(p => ({ value: propercase(p.pnm), label: propercase(p.pnm) }))
      .find(opt => opt.value === fparty) || null
    }
    onInputChange={(input, { action }) => {
      if (action === 'input-change') setFparty(propercase(input));
    }}
    onChange={(selected) => {
      if (selected) {
        setFparty(selected.value);
        fetchData(selected.value);
      } else setFparty('');
    }}
    openMenuOnFocus
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const inputValue = fparty.trim().toLowerCase();

        const bestMatch = partyList
          .map(p => propercase(p.pnm))
          .find(val => val.toLowerCase().startsWith(inputValue));

        if (bestMatch) {
          setFparty(bestMatch);
          fetchData(bestMatch);
          focusnextInput(e, fpartyref, dateRef);
        }
      }
    }}
    styles={{
      menuPortal: base => ({ ...base, zIndex: 9999 }),
      menu: base => ({ ...base, zIndex: 9999 }),
      control: base => ({ ...base, minHeight: '40px', fontSize: '1rem', width: '18vw', textAlign: 'center' }),
      singleValue: base => ({ ...base, textAlign: 'center' }),
      input: base => ({ ...base, textAlign: 'center' }),
    }}
  />
</div>

    {/* Group for Closing Balance */}
    <div className="input-group-row">
      <label htmlFor="cl_bal">Closing Balance</label>
      <input
        name="cl_bal"
        id="cl_bal"
        className="cl_bal"
        type="text"
        value={closingBalance}
        readOnly
        style={{
          color:
            closingBalance > 0
              ? 'blue'
              : closingBalance < 0
              ? 'red'
              : 'black',
          fontWeight: 'bold',
        }}
      />
      <span
        style={{
          fontWeight: 'bold',
          color:
            closingBalance > 0
              ? 'blue'
              : closingBalance < 0
              ? 'red'
              : 'black',
        }}
      >
        {closingBalance > 0
          ? 'Lene'
          : closingBalance < 0
          ? 'Dene'
          : ''}
      </span>
    </div>

    {/* Title and Tally checkbox */}
    <div className="input-group-row">
      <h1 style={{ marginBottom: '0' }}>Settling Entry</h1>
      <h1>
        <input
          type="checkbox"
          onClick={(e) => {
            e.preventDefault();
            Process_tally(e, fparty);
          }}
        />
        Tally
      </h1>
    </div>
  </div>
</div>

      {partyData && partyData.length > 0 ? (
        <div className="table-wrapper" id="table-wrapper" name="table-wrapper">
          
          <table>
          <thead><tr><th>Date</th><th>PartyName</th><th>Debit</th><th>Credit</th><th>Balance</th><th>Narrattion</th><th>T</th><th>Delete</th><th>Modify</th></tr></thead>  
          <tbody className="sett_tbody" id="sett_tbody" name="sett_tbody">
  {partyData.map((entry, index) => {
    runBal += entry.debit - entry.credit;
   
    const balanceColor = runBal > 0 ? "blue" : runBal < 0 ? "red":"black"; 
   const isLatest = entry._id === latestEntryId;

    return (
      <tr
        key={entry._id || index}
        ref={isLatest ? latestEntryRef : undefined}
        tabIndex={0}
        style={isLatest ? { backgroundColor: 'skyblue' } : {}}
       onKeyDown={(e) => handlerowkeydown(e,index,entry.txtnId)}
      >

        <td className='datetdr' id='datetdr' name='datetdr'>{format_date(entry.date)}</td>
        <td className='spartytdr' name='spartytdr' id='spartytdr'>{entry.sparty}</td>
        <td className='debit' name='debit' id='debit'>{entry.debit}</td>
        <td className='credit' name='credit' id='credit'>{entry.credit}</td>
        <td className='runbal' name='runbal' id='runbal' style={{color:balanceColor}}>{runBal}</td>
        <td className='narrattion' id='narrattion' name='narrattion'>{entry.narration}</td>
        <td className='tally' name='tally' id='tally'>{entry.tally}</td>
        <td><button key={entry.txtnId} type='button' name='delete_entry' id='delete_entry' className='delete_entry' onClick={(e) => {
  e.preventDefault();
  delete_entry(entry.txtnId); // only pass txtnId
}}
>🗑️</button></td>

        <td><button key={entry.txtnId} type='button' name='modify_entry' id='modify_entry' className='modify_entry' onClick={(e) => {
          e.preventDefault();
          modify_entry(entry.txtnId);
        }}>✏️</button></td>
      </tr>
    );
  })}
</tbody>
          </table>
        </div>
      ) : (
        <p>No data</p>
      )}
   
  


        <div className="footer">
         Date
          <input type="date" name="date" id="date" className="date"  ref={dateRef} value={date} onChange = {(e) => setDate(e.target.value)} onKeyDown = {(e) => focusnextInput(e,dateRef,spartyRef)}/>
Party
<Select
  id="sparty"
  ref={spartyRef}
  options={partyList.map(p => ({
    value: p.pnm,
    label: propercase(p.pnm),
  }))}
  value={
    sparty
      ? { value: sparty, label: propercase(sparty) }
      : null
  }
  onInputChange={(input, { action }) => {
    if (action === 'input-change') {
      setSparty(input);
    }
  }}
  onChange={(selected) => {
    setSparty(selected?.value || '');
  }}
  openMenuOnFocus
  menuPlacement="top"
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();

      const inputValue = sparty.trim().toLowerCase();

      // find first match using startsWith
      const bestMatch = partyList
        .map(p => p.pnm)
        .find(p => p.toLowerCase().startsWith(inputValue));

      if (bestMatch) {
        setSparty(bestMatch);
      }

      // prevent moving if fparty === sparty
      if (fparty === bestMatch) {
        spartyRef.current?.focus();
        return;
      }

      focusnextInput(e, spartyRef, debitref);
    }
  }}
  styles={{
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    menu: base => ({ ...base, zIndex: 9999 }),
    control: base => ({
      ...base,
      minHeight: '40px',
      fontSize: '1rem',
      width: '18vw',
      textAlign: 'center',
    }),
  }}
  onFocus={(e) => e.target.select()}
/>






 

          Debit
          <input type="number" className="debit" id="debit" name="debit" ref = {debitref} value = {debit} onChange = {handledebitcahange}  onKeyDown={(e)=>focusnextInput(e,debitref,creditref)}  onFocus={(e)=>e.target.select()}/>
          Credit
          <input type="number" className="credit" id="credit" name="credit" ref={creditref} value = {credit} onChange = {handlecreditchange} onKeyDown={(e)=>focusnextInput(e,creditref,narrattionref)}  onFocus={(e)=>e.target.select()}/>
          Narration
          <input type="text" className="narrattion" id="narrattion" name="narrattion" ref={narrattionref} value = {narration} onChange = {(e)=>setNarrattion(e.target.value)}  onFocus={(e)=>e.target.select()}/>

          <button className="submit_sett" name="submit_sett" id="submit_sett" type="submit" style={{display:isUpdating?'none':'inline-block'}}>
            Ok
          </button>
      <button className='upd_sett' name='upd_sett' id='upd_sett'   style={{ display: isUpdating ? 'inline-block' : 'none' }}>Update</button>
        </div>
    </form>
  );
};

export default SettlingEntry;

import { useState, useEffect, useRef,useMemo } from 'react';
import Swal from 'sweetalert2';
import './Settling.css';
import { useParty } from '../Context/partycontext';
import Select from 'react-select';
import propercase from '../functions/function';



const SettlingEntry = () => {
  const { partyList } = useParty();
const [fparty, setFparty] = useState(''); // selected party name (string)
const [inputValue, setInputValue] = useState(''); // input text in Select
const [sparty, setSparty] = useState('');       // selected party name (string)
  const [inputValueSparty, setInputValueSparty] = useState('');
 
const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
// use state and all ref and memo are declard here
  const dateRef = useRef(null);
  const spartyRef = useRef(null);
  const debitref = useRef(null);
  const creditref = useRef(null);
  const narrattionref = useRef(null);
  const fpartyref = useRef(null);
//get fparty

  const [debit,setDebit] = useState('');
  const [credit,setCredit] = useState('');
  const [narration,setNarrattion] = useState('');
  const [showDropdown,setShowDropdown] = useState(false);
  const [showSDropdown,setShowSDropdown] = useState(false);
  const [filteredSparties, setFilteredSparties] = useState([]);
  const [hoverIndexS, setHoverIndexS] = useState(0);
  const [latestEntryId, setLatestEntryId] = useState(null);
  const latestEntryRef = useRef(null);
 const [hoverIndex, setHoverIndex] = useState(0);
  const [partyData, setPartyData] = useState([]);
const [up_id,setup_id] = useState();  
 const [isUpdating, setIsUpdating] = useState(false);
const selectedOption = partyList
    .map(p => ({ value: p.pnm, label: p.pnm }))
    .find(opt => opt.value === sparty) || null;

 function format_date(dateString) {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
}


useEffect(()=>{
  fpartyref.current?.focus();
  
},[]);
useEffect(() => {
  if (fparty.trim()) {
    fetchData(fparty);
  } else {
    setPartyData([]); // clear if no party
  }
}, [fparty]);


// ✅ Memoized filteredParties
const filteredParties = useMemo(() => {
  if (!fparty.trim()) return [];
  const inputLower = fparty.toLowerCase();
  return partyList.filter(p =>
    p.pnm.toLowerCase().includes(inputLower)
  );
}, [fparty, partyList]);


  useEffect(() => {

    if (filteredParties.length > 0) {
      const inputLower = fparty.trim().toLowerCase();
      const bestMatchIndex = filteredParties.findIndex(p =>
        p.pnm.toLowerCase().startsWith(inputLower)
      );
      const fallbackIndex = filteredParties.findIndex(p =>
        p.pnm.toLowerCase().includes(inputLower)
      );
      setHoverIndex(
        bestMatchIndex !== -1 ? bestMatchIndex : fallbackIndex !== -1 ? fallbackIndex : 0
      );
    }
  }, [filteredParties, fparty]);

  //for select dropdown name and get entries

  const handleSelect = name => {
    setFparty(name);
    setShowDropdown(false);
   fetchData();
    setTimeout(() => {
      dateRef.current?.focus();
    }, 10);
  };


  //for focus next input
function focusnextInput(e, currentRef, nextRef) {
  const isSelectOpen = currentRef?.current?.state?.menuIsOpen;

  if (e.key === 'Enter' && !isSelectOpen) {
    e.preventDefault();
    nextRef?.current?.focus();
  }
}

useEffect(() => {
    const input = sparty.trim().toLowerCase();
    if (input) {
      const filtered = partyList.filter((p) => p.pnm?.toLowerCase().includes(input));
      setFilteredSparties(filtered);
      setShowSDropdown(filtered.length > 0);
    } else {
      setFilteredSparties([]);
      setShowSDropdown(false);
    }
  }, [sparty, partyList]);



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
        const response = await fetch('https://cute-beijinho-d62c23.netlify.app/settlingentry', {
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
        const response = await fetch(`https://cute-beijinho-d62c23.netlify.app/settlingentry/${up_id}`, {
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
    const response = await fetch(`https://cute-beijinho-d62c23.netlify.app/settlingentry/${txtnId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Delete success:',txtnId);
      await fetchData(fparty); // Make sure this function exists and is async if needed
   setHoverIndex(0);
    
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
    const response = await fetch(`https://cute-beijinho-d62c23.netlify.app/${txtnId}`, {
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

//my settling hovering through keydown
const handlerowkeydown=(e,index,txtnId)=>{
  e.preventDefault();
  const rowCount = partyData.length;
  console.log(rowCount);
  if(e.key=== "ArrowDown"){
    const nextIndex = (index + 1) < rowCount ? index + 1 : 0; 
    const nextRow = document.querySelectorAll('#sett_tbody tr')[nextIndex];
    nextRow?.focus();

}else if(e.key==="ArrowUp"){
    const previousIndex = (index-1) < rowCount ? index-1:0;
  const previousRow = document.querySelectorAll('#sett_tbody tr')[previousIndex];
    previousRow?.focus();
  }else if(e.key==="Delete"){
    delete_entry(txtnId);
  }else if(e.key==="F2"){
    modify_entry(txtnId);
  }
}

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
const response = await fetch(`https://cute-beijinho-d62c23.netlify.app/tally/${encodeURIComponent(fparty)}`,{
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
    const response = await fetch(
      `https://cute-beijinho-d62c23.netlify.app/settlingentry?fparty=${encodeURIComponent(party)}`,
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

 {/* Group for Party Name */}
<div className="input-group-row">
  PartyName
  <Select
    inputId="fparty"
    ref={fpartyref}
    options={partyList.map(p => ({ value: p.pnm, label: propercase(p.pnm) }))}
    value={partyList.find(p => p.pnm === fparty) ? { value: fparty, label: propercase(fparty) } : null}
    inputValue={propercase(fparty)}
    onInputChange={(input, { action }) => {
      if (action === 'input-change') {
        setFparty(input);
      }
    }}
    onChange={(selected) => {
      if (selected) {
        setFparty(selected.value);
        setInputValue(selected.value);
        fetchData(selected.value);
      } else {
        setFparty('');
        setInputValue('');
      }
    }}
    openMenuOnFocus={true}
    onBlur={() => {
      setInputValue(fparty);
    }}
    onKeyDown={(e) => {
      focusnextInput(e, fpartyref, dateRef);
    }}
    styles={{
      menuPortal: base => ({ ...base, zIndex: 9999 }),
      menu: base => ({ ...base, zIndex: 9999 }),
      control: base => ({
        ...base,
        minHeight: '40px',
        fontSize: '1rem',
        width: '18vw',
      }),
      singleValue: base => ({
        ...base,
        textAlign: 'center',
        width: '100%',
      }),
      input: base => ({
        ...base,
        textAlign: 'center',
      }),
    }}
    onFocus={(e) => e.target.select()}
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
 <div className="result" id="result">
      {partyData && partyData.length > 0 ? (
        <div className="table-wrapper">
          <table>
            <thead className="sett_head" id="sett_head" name="sett_head">
              <tr className='sett_headr' id="sett_headr" name="sett_header">
                <th>Date</th>
                <th>Party</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Balance</th>
                <th>Narration</th>
                <th>Tally</th>
                <th>Delete</th>
                <th>Modify</th>
              </tr>
            </thead>
          <tbody className="sett_tbody" id="sett_tbody" >
  {partyData.map((entry, index) => {
    runBal += entry.debit - entry.credit;
   const isLatest = entry._id === latestEntryId;

    return (
      <tr
        key={entry._id || index}
        ref={isLatest ? latestEntryRef : undefined}
        tabIndex={0}
        style={isLatest ? { backgroundColor: 'skyblue' } : {}}
       onKeyDown={(e) => handlerowkeydown(e,index,entry.txtnId)}
      >

        <td>{format_date(entry.date)}</td>
        <td>{entry.sparty}</td>
        <td>{entry.debit}</td>
        <td>{entry.credit}</td>
        <td>{runBal}</td>
        <td>{entry.narration}</td>
        <td>{entry.tally}</td>
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
    </div>
  


        <div className="footer">
         <label>Date</label> 
          <input type="date" name="date" id="date" className="date"  ref={dateRef} value={date} onChange = {(e) => setDate(e.target.value)} onKeyDown = {(e) => focusnextInput(e,dateRef,spartyRef)}/>

<label>Party</label>
<Select
  id="sparty"
  ref={spartyRef}
  options={partyList.map(p => ({ value: p.pnm, label: propercase(p.pnm) }))}
  value={partyList.find(p => p.pnm === sparty) ? { value: sparty, label: propercase(sparty) } : null}
  inputValue={propercase(sparty)}
  onInputChange={(input, { action }) => {
    if (action === 'input-change') {
      setSparty(input);
    }
  }}
  onChange={(selected) => {
    if (selected) {
      setSparty(selected.value);
    } else {
      setSparty('');
    }
  }}
  openMenuOnFocus={true}
  onBlur={() => {
    // Optional: any blur logic
  }}
  onKeyDown={(e) => {
    // Prevent focusing next input if fparty equals sparty
    if ((e.key === 'Enter' || e.key === 'Tab') && fparty === sparty) {
      e.preventDefault();
      spartyRef.current.focus();
      return;
    }

    // Proceed to next input
    focusnextInput(e, spartyRef, debitref);
  }}
  menuPlacement="top"
  styles={{
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    menu: base => ({ ...base, zIndex: 9999 }),
    control: base => ({
      ...base,
      minHeight: '40px',
      fontSize: '1rem',
      width: '18vw',
      textAlign:'center',
    }),
  }}
 onFocus={(e)=>e.target.select()}

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

// development environment
import { useState, useRef, useEffect } from 'react';
import './Party.css';
import { useParty } from '../Context/partycontext';
import Swal from 'sweetalert2';
import propercase from '../functions/function';

const PartyAdd = () => {
  const today = new Date().toISOString().split('T')[0]; 
  const [pnm, setPnm] = useState('');
  const [gnm, setGnm] = useState('');
  const [mob, setMob] = useState('');
  const [jdate, setJdate] = useState(today);

  const pnmRef = useRef(null);
  const gnmRef = useRef(null);
  const mobRef = useRef(null);
  const jdRef = useRef(null);

  const { partyList, fetchPartyList } = useParty();

  const nextinput = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (pnmRef.current && pnmRef.current.value.trim() !== '') {
        nextRef.current?.focus();
      } else {
        pnmRef.current?.focus();
      }
    }
  };

  const Submitform = async (e) => {
    e.preventDefault();
    
    // Validate required field
    if (!pnm.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'Party name is required!',
        icon: 'error',
      });
      pnmRef.current.focus();
      return;
    }

    const FormData = { pnm, gnm, mob, jdate };

    try {
      // FIXED: Use correct API endpoint
      const response = await fetch('http://178.16.139.134:5000/api/partyadd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(FormData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Server response:', data);
      
   //   Swal.fire({
     //   title: 'Success!',
      //  text: 'Party added successfully',
       // icon: 'success',
      //});
      
      fetchPartyList(); 
      setPnm('');
      setGnm('');
      setMob('');
      pnmRef.current.focus();
    } catch (err) {
      console.error('Error sending Data:', err);
      Swal.fire({
        title: 'Error',
        text: 'Failed to add party. Please try again.',
        icon: 'error',
      });
    }
  };

  const alertdeelte = async (e, id) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: 'Are you sure you want to delete this party?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        // FIXED: Use correct API endpoint
        const response = await fetch(`http://178.16.139.134:5000/api/partyadd/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to delete');

        Swal.fire({
          title: 'Deleted!',
          text: 'The party has been successfully deleted.',
          icon: 'success',
        });

        fetchPartyList(); // Refresh list after deletion
      } catch (err) {
        console.error('Error in delete record', err);
        Swal.fire({
          title: 'Error',
          text: 'There is pending balance or deletion failed',
          icon: 'error',
        });
      }
    }
  };

  useEffect(() => {
    pnmRef.current.focus();
  }, []);

  return (
    <section className="mypartyadd" id="mypartyadd" name="mypartyadd">
      <div className="party-form-container">
        <div className='party_head' name='party_head' id='party_head'><h1>Party Add/Delete</h1></div>
        <form onSubmit={Submitform}>
          <div className="form-group">
            <label htmlFor="pnm">Party Name:</label>
            <input type="text" name="pnm" id="pnm" ref={pnmRef} value={propercase(pnm)} onChange={(e)=>setPnm(e.target.value)} onKeyDown={(e)=>nextinput(e,gnmRef)} className="input-field" placeholder="Enter PartyName Here..." autoComplete='off'/>
          </div>
          <div className="form-group">
            <label htmlFor="gnm">Gauranter Name:</label>
            <input type="text" name="gnm" id="gnm" ref={gnmRef} value={gnm} onChange={(e)=>setGnm(e.target.value)} onKeyDown={(e)=>nextinput(e,mobRef)} className="input-field" placeholder="Enter Gaurantor Here..." autoComplete='off'/>
          </div>
          <div className="form-group">
            <label htmlFor="mob">Mobile:</label>
            <input type="text" name="mob" id="mob" ref={mobRef} value={mob} onChange={(e)=>setMob(e.target.value)} onKeyDown={(e)=>nextinput(e,jdRef)}  className="input-field" placeholder="Enter Mobile Here..." />
          </div>
          <div className="form-group">
            <label htmlFor="mob">Jdate:</label>
            <input type="date" name="jdate" id="jdate" ref={jdRef} value={jdate} onChange={(e)=>setJdate(e.target.value)}  className="input-field" placeholder="Enter Date Here......." />
          </div>
       
          <button className="submit-btn" Name="submit-btn" id="submit-btn">OK</button>
        </form>
      </div>
     <div className="results" id="results"> 
        <div className='party_head' name='party_head' id='party_head'><h1>PartyList</h1></div>      
        {partyList.length === 0 ? (
          <p>No results found</p>
        ) : (
          partyList.map((item, index) => (
            <div key={index} className="result-item" id="result-item" name="result-item">
              <div className="party-entry" id="party-entry" name="party-entry">
                <strong>{item.pnm}</strong>
                <button onClick={(e) => alertdeelte(e, item._id)} className='dl_bt' id='dl_bt' name='dl_bt'>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default PartyAdd;

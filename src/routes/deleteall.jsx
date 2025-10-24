import React from 'react';
import Swal from 'sweetalert2';
import './deleetall.css';
const Deleteall = () => {
  // Function should be declared outside the return
  const hnddelete_All = async() => {
const result = await Swal.fire({
    title: 'Are you sure?',
      text: 'This will permanently delete ALL records!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete all!',
      cancelButtonText: 'Cancel',
})
if(!result.isConfirmed)return;
try{
const url = await fetch('http://localhost:5000/deleteall',{
    method:'DELETE',
    headers:{
        'Content-Type':'application/json',

    }
});
if(url.ok){
    Swal.fire('deleted','success');
}
}catch(err){
console.error('Delete all error:', err);
      Swal.fire('Error', 'Something went wrong.', 'error');
}
};

  return (
    <>
    
    <div className='dl_all_container' id='dl_all_container' name='dl_all_container'>
      <h1>DELETE ALL Records</h1>
      <button onClick={hnddelete_All} className='delete_btn' id='delete_btn' name='delete_btn'>DELETE RECORDS</button>
    </div>
    </>
  );
};

export default Deleteall;

import Swal from 'sweetalert2';
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
      <h1>DELETE ALL</h1>
      <button onClick={hnddelete_All}>DELETE RECORDS</button>
    </>
  );
};

export default Deleteall;

import {Fragment, useState, useEffect} from 'react'
import Navigation from '../components/Navbar'
import {Link} from 'react-router-dom'
const admin=localStorage.getItem(`isAdmin`)
const id=localStorage.getItem(`id`)
const token=localStorage.getItem(`token`)

export default function Profile(){
	const[adminLength,setAdminL]=useState();
	const[userLength,setUserL]=useState();
	const[users,setUsers]=useState();
	const[admins,setAdmins]=useState()

	const fetchUsers = () =>{
		fetch(`https://capstone2-bederi.herokuapp.com/api/users/users`,{
				method:"GET",
				headers:{
					"Authorization":`Bearer ${token}`
				}
			})
			.then(result => result.json())
			.then(result => {
			setUserL(result.length)

			setUsers(result.map(users =>{
				const {
					_id:userId,
					firstName:userFN,
					lastName:userLN,
					email:userEmail,
					createdAt:userDate
					}=users
				const userNum = result.indexOf(users)+1

					

				return(
					<tr key={userId}>
					  <th scope="row" id="userIndex">{userNum}</th>
					  <td>{userId}</td>
					  <td>{userFN} {userLN}</td>
					  <td>{userEmail}</td>
					  <td>{userDate}</td>
					  <td><button className="btn btn-danger mx-3" onClick={()=>handleDelete(userEmail)}><small>Delete</small></button>
					  <button className="btn btn-info" onClick={()=>handleAdmin(userEmail)}><small>Make Admin</small></button></td>
					</tr>

				)
			}))
		})
	}

	const fetchAdmins = () =>{
		fetch(`https://capstone2-bederi.herokuapp.com/api/users/admins`,{
				method:"GET",
				headers:{
					"Authorization":`Bearer ${token}`
				}
			})
			.then(result => result.json())
			.then(result => {
			// Length.innerHTML=`${result.length}`

			setAdmins(result.map(users =>{
				const {
					_id:userId,
					firstName:userFN,
					lastName:userLN,
					email:userEmail,
					createdAt:userDate
					}=users
				const userNum = result.indexOf(users)+1

					

				return(
					<tr key={userId}>
					  <th scope="row" id="userIndex">{userNum}</th>
					  <td>{userId}</td>
					  <td>{userFN} {userLN}</td>
					  <td>{userEmail}</td>
					  <td>{userDate}</td>
					  <td><button className="btn btn-danger mx-3" onClick={()=>handleDelete(userEmail)}><small>Delete</small></button>
					  <button className="btn btn-info" onClick={()=>handleUser(userEmail)}><small>Make User</small></button></td>
					</tr>

				)
			}))
		})
	}

	useEffect(()=>{
		fetchUsers()
		fetchAdmins()
	},[])

	// const fetchUserData=()=>{
	// 	fetch(`http://localhost:3009/api/users/${id}`,{
	// 		method:"GET",
	// 		headers:{
	// 			"Authorization":`Bearer ${token}`
	// 		}
	// 	})
	// 	.then(result => result.json())
	// 	.then(result => {
	// 		setUserId(`${result._id}`)
	// 		setFullName(`${result.firstName} ${result.lastName}`)
	// 		setEmail(`${result.email}`)
	// 		setContact(`${result.contact}`)
	// 		setGender(`${result.gender}`)
	// 		setBday(`${result.bday}`)
	// 		setAddress(`${result.address}`)
	// 	})
	// }

	const handleDelete = (userEmail) =>{
			fetch(`https://capstone2-bederi.herokuapp.com/api/users/deleteUser`,{
				method:"DELETE",
				headers:{
					"Content-Type":"application/json",
					"Authorization":`Bearer ${token}`
				},
				body:JSON.stringify({
					email:userEmail
				})
			})
				.then(result => result)
				.then(result=>{
					fetchUsers()
					fetchAdmins()
				})
			}

	const handleAdmin = (userEmail) =>{
			fetch(`https://capstone2-bederi.herokuapp.com/api/users/isAdminT`,{
				method:"PATCH",
				headers:{
					"Content-Type":"application/json",
					"Authorization":`Bearer ${token}`
				},
				body:JSON.stringify({
					email:userEmail
				})
			})
				.then(result => result)
				.then(result=>{
					fetchUsers()
					fetchAdmins()
				})
			}
	
	const handleUser = (userEmail) =>{
			fetch(`https://capstone2-bederi.herokuapp.com/api/users/isAdminF`,{
				method:"PATCH",
				headers:{
					"Content-Type":"application/json",
					"Authorization":`Bearer ${token}`
				},
				body:JSON.stringify({
					email:userEmail
				})
			})
				.then(result => result)
				.then(result=>{
					fetchUsers()
					fetchAdmins()
				})
			}

	return(
		<Fragment>
		<Navigation />
		<div className="container-fluid profileContainer">
			<div className="row justify-content-center m-3">
				<div className="col-10 col-md-8 sideNav m-5">
				<h1 className="text-center">Admin Dashboard</h1>
					<table className="table table-striped table-dark">
					  <thead>
					    <tr>
					      <th scope="col">#</th>
					      <th scope="col">Name</th>
					      <th scope="col">Email</th>
					      <th scope="col">Created On</th>
					    </tr>
					  </thead>
					  <tbody>
					    {admins}
					  </tbody>
					</table>

					<table className="table table-striped table-dark">
					  <thead>
					    <tr>
					      <th scope="col">#</th>
					      <th scope="col">Name</th>
					      <th scope="col">Email</th>
					      <th scope="col">Created On</th>
					    </tr>
					  </thead>
					  <tbody>
					    {users}
					  </tbody>
					</table>

				</div>
			</div>
		</div>
		</Fragment>
		)
}
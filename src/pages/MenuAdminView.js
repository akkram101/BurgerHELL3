import {Fragment, useState, useEffect} from 'react'
import Navigation from '../components/Navbar'
import Categories from '../components/Categories'
const token=localStorage.getItem(`token`)
const id=localStorage.getItem(`id`)

export default function MenuAdminView(){
	const [Meals,setMeals] =useState()
	const [Burgers,setBurgers] =useState()
	const [Sides,setSides] =useState()
	const [Beverages,setBeverages] =useState()

	const [EditItemName, setItemName]=useState()
	const [EditItemDesc, setItemDesc]=useState()
	const [EditItemPrice, setItemPrice]=useState()

	const Inactive =  (id) =>{
		fetch(`https://capstone2-bederi.herokuapp.com/api/item/${id}/soldOut`,{
			method:"PATCH",
			headers:{
				"Authorization":`Bearer ${token}`
			}
		})
		.then(result=>result.json())
		.then(result =>{
			fetchMenuItems()
		})
	}

	const Active =  (id) =>{
		fetch(`https://capstone2-bederi.herokuapp.com/api/item/${id}/returnItem`,{
			method:"PATCH",
			headers:{
				"Authorization":`Bearer ${token}`
			}
		})
		.then(result=>result.json())
		.then(result =>{
			fetchMenuItems()
		})
	}
	
	const fetchMenuItems = () =>{
		fetch(`http://localhost:3009/api/item/meals`,{
			method:"GET"
		})
		.then(result=>result.json())
		.then(result =>{
			if(result.length<1){
				setMeals("No Meals Available")
			}else {
				setMeals(
					result.map(meals => {
					const {itemName, description, price, _id, isAvailable} = meals
					const menuTargetModalId= `#menu${_id}`
					const menuModalId=`menu${_id}`
					const menuForm=`${_id}Form`
					const addCart=`${_id}addCart`
					const quant=`${_id}quant`

					let NewItemName;
					
					return(		
						<Fragment key={_id}>				
							<div className="col-6 col-sm-3 p-3" >
								<a href="#" data-toggle="modal" data-target={menuTargetModalId}>
								<img src="../images/sampleMeal.png" width="200px" height="200px" className="img-fluid" />
								</a>
								<div className="">
									<p className="d-inline">{itemName}</p>
									{	
										isAvailable==true
										?																
										<button className="btn btn-danger m-3" onClick={() =>Inactive(_id)}>Inactive</button>
										:
										<button className="btn btn-success m-3" onClick={()=>Active(_id)}>Active</button>
									}									
								</div>
							</div>
							<div className="modal fade editModal" id={menuModalId} tabIndex="-1" aria-labelledby="${_id}ModalLabel" aria-hidden="true">
							  <div className="modal-dialog modal-dialog-centered modal-lg">
							    <div className="modal-content">
							      <div className="modal-body container  text-left d-flex">
							      	<div className="row">
								      	<div className="col-4">
								      	<img src="../images/sampleMeal.png" width="300px" height="300px" className="img-fluid modal-title mx-auto modalimg" />
								     	</div>
								     	<div className="col-8">
								      	<small>
					        	       	  <form className="text-dark">
		    	       	  				      <div className="form-group editForm">
		    	       	  				          <label htmlFor="${_id}itemName" className="text-dark">Item Name</label>
		    	       	  				          <input type="text" className="form-control" defaultValue={itemName} onChange={(e)=>setItemName(e.target.value)}required />
		    	       	  				        </div>
		    	       	  				        <div className="form-group">
		    	       	  				          <label htmlFor="${_id}itemDesc">Description</label>
		    	       	  				          <input type="text" className="form-control" rows="3"defaultValue={description} onChange={(e)=>setItemDesc(e.target.value)} required/>
		    	       	  				        </div>
		    	       	  				        <div className="form-group">
		    	       	  				          <label htmlFor="${_id}itemPrice">Price</label>
		    	       	  				          <input type="text" rows="5" className="form-control" defaultValue={price} onChange={(e)=>setItemPrice(e.target.value)} required />
		    	       	  				        </div>
		    	       	  				     </form>
		    	       	  				</small>
		    	       	  				</div>
        	       	  				</div>
        	       	  				
							      </div>
							      <div className="modal-footer">
							        <button type="submit" className="btn btn-warning btn-block" data-dismiss="modal" onClick={()=>UpdateItem(EditItemName,EditItemDesc,EditItemPrice)}>Save</button>
							      </div>
							    </div>
							  </div>
							</div>
						</Fragment>
						)

					})
				)
			} 
		})

		fetch(`https://capstone2-bederi.herokuapp.com/api/item/burgers`,{
				method:"GET"
			})
			.then(result=>result.json())
			.then(result =>{
				if(result.length<1){
					setBurgers("No Meals Available")
				}else {
					setBurgers(
						result.map(result => {
						const {itemName, description, price, _id, isAvailable} = result
						const burgerTargetModalId= `#burger${_id}`
						const burgerModalId=`burger${_id}`
						const addCart=`${_id}addCart`
						const quant=`${_id}quant`
						return(		
						<Fragment key={_id}>				
							<div className="col-6 col-sm-3" >
								<a href="#" data-toggle="modal" data-target={burgerTargetModalId}> 
								<img src="../images/sampleBurger.png" width="200px" height="200px" className="img-fluid" />
								</a>
								<div className="">
									<p className="d-inline">{itemName}</p>
									{	
										isAvailable==true
										?																
										<button className="btn btn-danger m-3" onClick={() =>Inactive(_id)}>Inactive</button>
										:
										<button className="btn btn-success m-3" onClick={()=>Active(_id)}>Active</button>
									}									
								</div>
							</div>
							<div className="modal fade" id={burgerModalId} tabIndex="-1" aria-labelledby="${_id}ModalLabel" aria-hidden="true">
							  <div className="modal-dialog modal-dialog-centered">
							    <div className="modal-content">
							      <div className="modal-header">
							      	<img src="../images/sampleBurger.png" width="300px" height="300px" className="img-fluid modal-title mx-auto" />
							        
							      
							      </div>
							      <div className="modal-body text-left p-3 m-3">
							        <h4 id="${_id}OrderName"><strong>{itemName}</strong></h4>
							        <p>${price}</p>
							        <p>{description}</p>
							      </div>
							      <div className="modal-footer">
							        <button type="submit" className="btn btn-warning btn-block" data-dismiss="modal">Edit</button>
							      </div>
							    </div>
							  </div>
							</div>
						</Fragment>
							)

						})
					)
				} 
			})	
		fetch(`https://capstone2-bederi.herokuapp.com/api/item/sides`,{
				method:"GET"
			})
			.then(result=>result.json())
			.then(result =>{
				if(result.length<1){
					setSides("No Sides Available")
				}else {
					setSides(
						result.map(result => {
						const {itemName, description, price, _id, isAvailable} = result
						const menuTargetModalId= `#menu${_id}`
						const menuModalId=`menu${_id}`
						const addCart=`${_id}addCart`
						const quant=`${_id}quant`
						return(		
						<Fragment key={_id}>				
							<div className="col-6 col-sm-3" >
								<a href="#" data-toggle="modal" data-target={menuTargetModalId}> 
								<img src="../images/sampleSide.png" width="200px" height="200px" className="img-fluid" />
								</a>
								<div className="">
									<p className="d-inline">{itemName}</p>
									{	
										isAvailable==true
										?																
										<button className="btn btn-danger m-3" onClick={() =>Inactive(_id)}>Inactive</button>
										:
										<button className="btn btn-success m-3" onClick={()=>Active(_id)}>Active</button>
									}									
								</div>
							</div>
							<div className="modal fade" id={menuModalId} tabIndex="-1" aria-labelledby="${_id}ModalLabel" aria-hidden="true">
							  <div className="modal-dialog modal-dialog-centered">
							    <div className="modal-content">
							      <div className="modal-header">
							      	<img src="../images/sampleSide.png" width="300px" height="300px" className="img-fluid modal-title mx-auto" />
							        
							        
							      </div>
							      <div className="modal-body text-left p-3 m-3">
							        <h4 id="${_id}OrderName"><strong>{itemName}</strong></h4>
							        <p>${price}</p>
							        <p>{description}</p>
							      </div>
							      <div className="modal-footer">
							        <button type="submit" className="btn btn-warning btn-block" data-dismiss="modal">Edit</button>
							      </div>
							    </div>
							  </div>
							</div>
						</Fragment>
							)

						})
					)
				} 
			})
		fetch(`https://capstone2-bederi.herokuapp.com/api/item/beverages`,{
				method:"GET"
			})
			.then(result=>result.json())
			.then(result =>{
				if(result.length<1){
					setBeverages("No Sides Available")
				}else {
					setBeverages(
						result.map(result => {
						const {itemName, description, price, _id, isAvailable} = result
						const menuTargetModalId= `#menu${_id}`
						const menuModalId=`menu${_id}`
						const addCart=`${_id}addCart`
						const quant=`${_id}quant`
						return(		
						<Fragment key={_id}>				
							<div className="col-6 col-sm-3" >
								<a href="#" data-toggle="modal" data-target={menuTargetModalId}> 
								<img src="../images/sampleBeverage.png" width="200px" height="200px" className="img-fluid" />
								</a>
								<div className="">
									<p className="d-inline">{itemName}</p>
									{	
										isAvailable==true
										?																
										<button className="btn btn-danger m-3" onClick={() =>Inactive(_id)}>Inactive</button>
										:
										<button className="btn btn-success m-3" onClick={()=>Active(_id)}>Active</button>
									}									
								</div>
							</div>
							<div className="modal fade" id={menuModalId} tabIndex="-1" aria-labelledby="${_id}ModalLabel" aria-hidden="true">
							  <div className="modal-dialog modal-dialog-centered">
							    <div className="modal-content">
							      <div className="modal-header">
							      	<img src="../images/sampleBeverage.png" width="300px" height="300px" className="img-fluid modal-title mx-auto" />
							        
							       
							      </div>
							      <div className="modal-body text-left p-3 m-3">
							        <h4 id="${_id}OrderName"><strong>{itemName}</strong></h4>
							        <p>${price}</p>
							        <p>{description}</p>
							      </div>
							      <div className="modal-footer">
							        <button type="submit" className="btn btn-warning btn-block" data-dismiss="modal">Edit</button>
							      </div>
							    </div>
							  </div>
							</div>
						</Fragment>
							)

						})
					)
				} 
			})

	}

	const UpdateItem = (EditItemName,EditItemDesc,EditItemPrice) =>{
		// fetch(`http://localhost:3009/api/item/updateItem`,{
		// 	method:"PUT",
		// 	headers:{
		// 		"Content-Type":"application/json",
		// 		"Authorization":`Bearer ${token}`
		// 	},
		// 	body:JSON.stringify({
		// 		id:id,
		// 		itemName:document.getElementById(`${id}editMealName`).value,
		// 		description:document.getElementById(`${id}editMealDesc`).value,
		// 		price:document.getElementById(`${id}editMealPrice`).value
		// 	})
		// })
		// .then(result => result.json())
		// .then(result =>  {
		// 	alert(`Item updated`)
		// 	fetchMenuItems()
		// }) 
		console.log(EditItemName)
		console.log(EditItemDesc)
		console.log(EditItemPrice)
		fetchMenuItems()
	}

	useEffect(()=>{
		fetchMenuItems()
	},[])


	return(
		<Fragment>
			<div className="container-fluid menu">
				<div className="row text-center justify-content-center">
					<div className="col-12 col-md-9">
						<Categories />
						<h1 className="text-center m-5">Meals</h1>
						<div className="row align-items-center">
						{Meals}
						</div>
						<h1 className="text-center m-5">Burgers</h1>
						<div className="row align-items-center">
						{Burgers}
						</div>
						<h1 className="text-center m-5">Sides</h1>
						<div className="row align-items-center">
						{Sides}
						</div>
						<h1 className="text-center m-5">Beverages</h1>
						<div className="row align-items-center">
						{Beverages}
						</div>
					</div>
				</div>
			</div>
		</Fragment>
		)

}
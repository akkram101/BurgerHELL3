import {Fragment, useState, useEffect} from 'react'
import Navigation from '../components/Navbar'
import Categories from '../components/Categories'
import MenuAdminView from './MenuAdminView'
const token=localStorage.getItem(`token`)
const id=localStorage.getItem(`id`)
const admin=localStorage.getItem(`isAdmin`)
export default function Menu() {

	const [Meals,setMeals] =useState()
	const [Burgers,setBurgers] =useState()
	const [Sides,setSides] =useState()
	const [Beverages,setBeverages] =useState()
	const [Cart, setCart]=useState()
	const [Note,setNote]=useState("")

	const [quantity, setQuantity]=useState(1)
	const [CartQuant,setCartQuant]=useState()
	const [total,setTotal]=useState(0)

	const quantityIncrement = () =>{
		setQuantity(prevQuantity => prevQuantity + 1)
	}

	const quantityDecrement = () =>{
		if(quantity>1){
			setQuantity(prevQuantity => prevQuantity -1)
		}else{
			setQuantity(1)
		}
	}

	const checkOut = (id) =>{
		if(token!=undefined){
			fetch(`https://capstone2-bederi.herokuapp.com/api/users/${id}`,{
				method:"GET",
				headers:{
					"Authorization":`Bearer ${token}`
				}
			})
			.then(result => result.json())
			.then(result => {

				const cart=result.Order
				if(cart.length>=1){
					fetch(`https://capstone2-bederi.herokuapp.com/api/users/${id}/emptyCart`,{
						method:"PUT",
						headers:{
							"Authorization":`Bearer ${token}`
						}
					})
					.then(result => result.json())
					.then(result => {
						alert('Order Successful')
						setTotal(0)
						setNote("")
						fetchCart()
					})
				}else{
					alert('No items in cart')
				}
			})
		}else{
			alert('Please Log in')
		}
	}

	const fetchCart = () =>{
		fetch(`https://capstone2-bederi.herokuapp.com/api/users/${id}`,{
			method:"GET",
			headers:{
				"Authorization":`Bearer ${token}`
			}
		})
		.then(result => result.json())
		.then(result => {
			let total=0
			const cart=result.Order
			if(cart.length>=1){
				setCart(
					cart.map(cartItem=>{
							const cartRow=cart.indexOf(cartItem)+1
							const index=cart.indexOf(cartItem)
							const quantity=cartItem.quantity
							return (
								<tr key={cartItem._id}>
								  <th scope="row">{cartRow}</th>
								  <td className="itemName">{cartItem.itemName}</td>
								  <td>{cartItem.price}</td>
								  <td>
								  	<a className="btn btn-warning mx-3" onClick={()=>CartDecrement(id,index,quantity)}>-</a>
								  	<span>{cartItem.quantity}</span>
								  	<a className="btn btn-warning mx-3" onClick={()=>CartIncrement(id,index)}>+</a>
								  </td>
								  <td>{(cartItem.price*cartItem.quantity)}</td>
								</tr>
								)
						})
					)
			}else{
				setCart(
					<tr>
					<td>No items in cart</td>
					</tr>
					)
			}

			cart.forEach(cartItem=>{
				let subTotal=(cartItem.price*cartItem.quantity)
					setTotal(total+=subTotal)
				})
			})
	}

	const CartIncrement = (id, index) =>{
		fetch(`https://capstone2-bederi.herokuapp.com/api/users/${id}/addCartQuant`,{
			method:"PATCH",
			headers:{
				"Content-Type":"application/json",
				"Authorization":`Bearer ${token}`
			},
			body: JSON.stringify({
				index:index
			})
		})
		.then(result=>result.json())
		.then(result=>{
			fetchCart()
		})
	}

	const CartDecrement = (id, index, quantity) =>{
		if(quantity<=1){
			alert(`Cannot be less than 1`)
		}else{
			fetch(`https://capstone2-bederi.herokuapp.com/api/users/${id}/lessCartQuant`,{
			method:"PATCH",
			headers:{
				"Content-Type":"application/json",
				"Authorization":`Bearer ${token}`
			},
			body: JSON.stringify({
				index:index
			})
		})
		.then(result=>result.json())
		.then(result=>{
			fetchCart()
		})
		}
	}

	const addToCart = (meals,quantity) =>{
		if(token!=undefined){
			const {itemName, description, price, _id} = meals
			fetch(`https://capstone2-bederi.herokuapp.com/api/users/order`,{
						method:"POST",
						headers:{
							"Content-Type":"application/json",
							"Authorization":`Bearer ${token}`
						},
						body:JSON.stringify({
							itemId:_id,
							itemName:itemName,
							quantity:quantity,
							price:price,
							totalAmount: (price*quantity)
						})
					})
					.then(result=>result.json)
					.then(result => {
						setQuantity(1)
						fetchCart()
					})
				}else{
					alert('Please Log in')
				}
	}


	useEffect(()=>{
		fetchCart()
	},[])



	useEffect( ()=>{
	fetch(`https://capstone2-bederi.herokuapp.com/api/item/meals`,{
			method:"GET"
		})
		.then(result=>result.json())
		.then(result =>{
			if(result.length<1){
				setMeals("No Meals Available")
			}else {
				setMeals(
					result.map(meals => {
					const {itemName, description, price, _id} = meals
					const menuTargetModalId= `#menu${_id}`
					const menuModalId=`menu${_id}`
					const menuForm=`${_id}Form`
					const addCart=`${_id}addCart`
					const quant=`${_id}quant`
					return(		
					<Fragment key={_id}>				
						<div className="col-6 col-sm-3" >
							<a href="#" data-toggle="modal" data-target={menuTargetModalId}> 
							<img src="../images/sampleMeal.png" width="200px" height="200px" className="img-fluid" />
							</a>
							<p>{itemName}</p>
						</div>
						<div className="modal fade" id={menuModalId} tabIndex="-1" aria-labelledby="${_id}ModalLabel" aria-hidden="true">
						  <div className="modal-dialog modal-dialog-centered">
						    <div className="modal-content">
						      <div className="modal-header">
						      	<img src="../images/sampleMeal.png" width="300px" height="300px" className="img-fluid modal-title mx-auto" />
						     
						      </div>
						      <div className="modal-body text-left p-3 m-3">
						        <h4 id="${_id}OrderName"><strong>{itemName}</strong></h4>
						        <p>${price}</p>
						        <p>{description}</p>
				         		<div className="text-center"><strong>
				         			<button className="btn btn-warning mx-3" onClick={quantityDecrement}>-</button>
				         			<span id={quant}>{quantity}</span>
				         			<button className="btn btn-warning mx-3" onClick={quantityIncrement}>+</button></strong>						        
				         		</div>
						      </div>
						      <div className="modal-footer">
						        <button type="submit" className="btn btn-warning btn-block" data-dismiss="modal" onClick={()=>addToCart(meals,quantity)}>Add to Cart</button>
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
	}, [quantity])

	useEffect( ()=>{
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
					const {itemName, description, price, _id} = result
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
							<p>{itemName}</p>
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
				         		<div className="text-center"><strong>
				         			<button className="btn btn-warning mx-3" onClick={quantityDecrement}>-</button>
				         			<span id={quant}>{quantity}</span>
				         			<button className="btn btn-warning mx-3" onClick={quantityIncrement}>+</button></strong>						        
				         		</div>
						      </div>
						      <div className="modal-footer">
						        <button type="submit" className="btn btn-warning btn-block" data-dismiss="modal" onClick={()=>addToCart(result,quantity)}>Add to Cart</button>
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
	}, [quantity])

	useEffect( ()=>{
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
					const {itemName, description, price, _id} = result
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
							<p>{itemName}</p>
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
				         		<div className="text-center"><strong>
				         			<button className="btn btn-warning mx-3" onClick={quantityDecrement}>-</button>
				         			<span id={quant}>{quantity}</span>
				         			<button className="btn btn-warning mx-3" onClick={quantityIncrement}>+</button></strong>						        
				         		</div>
						      </div>
						      <div className="modal-footer">
						        <button type="submit" className="btn btn-warning btn-block" data-dismiss="modal" onClick={()=>addToCart(result,quantity)}>Add to Cart</button>
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
	}, [quantity])

	useEffect( ()=>{
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
					const {itemName, description, price, _id} = result
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
							<p>{itemName}</p>
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
				         		<div className="text-center"><strong>
				         			<button className="btn btn-warning mx-3" onClick={quantityDecrement}>-</button>
				         			<span id={quant}>{quantity}</span>
				         			<button className="btn btn-warning mx-3" onClick={quantityIncrement}>+</button></strong>						        
				         		</div>
						      </div>
						      <div className="modal-footer">
						        <button type="submit" className="btn btn-warning btn-block" data-dismiss="modal" onClick={()=>addToCart(result,quantity)}>Add to Cart</button>
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
	}, [quantity])

	return(
		<Fragment>
			<Navigation />
			{
				admin=="false" || admin==undefined
			?
			<Fragment>
				<div className="container-fluid menu">
					<div className="row text-center">
						<div className="col-12 col-md-8">
						<Categories />
							<h1 id="mealsh1">MEALS</h1>
							<div className="row align-items-center" id="meals">
							{Meals}
							</div>
							<h1 id="burgersh1">BURGERS</h1>
							<div className="row" id="burgers">
							{Burgers}
							</div>
							<h1 id="sidesh1">SIDES</h1>
							<div className="row " id="sides">
							{Sides}															
							</div>
							<h1 id="beveragesh1">BEVERAGES</h1>
							<div className="row " id="beverages">
							{Beverages}	
							</div>
						</div>
						<div className="col-12 col-md-4 cart sticky-top text-left">
							<div className="cart m-3">
							<p className="text-left"><i className="fa fa-map-marker"></i>  Delivering to: 1810 Antonio Rivera Street, Manila</p>
							<table className="table">
							  <thead>
							    <tr>
							      <th scope="col"></th>
							      <th scope="col">Item Name</th>
							      <th scope="col">Price</th>
							      <th scope="col">Quantity</th>
							      <th scope="col">Total</th>
							    </tr>
							  </thead>
							  <tbody>
							  {Cart}
							  </tbody>
							</table>
							<div className="m-3 total p-3">
								<p className="text-right">Subtotal:  <span><strong>&#8369;{total}</strong></span></p>
								<p>Note:</p>
								<input type="text" placeholder="Note to restaurant" className="p-3 d-block note" onChange={(e)=>setNote(e.target.value)}/>
							</div>
							<button className="btn btn-block btn-warning m-5" onClick={()=>checkOut(id)}>Check Out</button>
							</div>					
						</div>
					</div>
				</div>
			</Fragment>
			:
			<Fragment>
				<MenuAdminView />
			</Fragment>
			}
		</Fragment>
		)
}
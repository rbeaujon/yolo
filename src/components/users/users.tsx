import React, { useContext, useEffect, useState } from "react";
import { LeftMenu } from "../menu/leftMenu/leftMenu";
import { TopMenu } from "../menu/topMenu/topMenu";
import { UsersApi } from "../../services/API/users.api";
import Loader from "../../helpers/Loader/loader";

import './users.styles.scss';
import { UsersModal } from "./usersModal/usersModal";
import { IsDarkContext } from "../../context/context";

interface DecodedProfileImageUsersType {
  id: number;
  name: string;
  email: string;
  status: number;
  pic: string;
  level: string;
  address: string;
}

type SortByType = "status" | "email";

interface ErrorType {
  message: string;
}


export const Users = () => {

  //import images
  const add = require("../../assets/icons/add.png");
  const edit = require( "../../assets/icons/edit.png");
  const trash =require( "../../assets/icons/trash.png");
  const sort = require( "../../assets/icons/sort.png");
  const searchIcon =require( "../../assets/icons/find.png");

  const  isDarkContext = useContext(IsDarkContext);
  const isDark = isDarkContext?.isDark

  const [users, setUsers] = useState<DecodedProfileImageUsersType[]>([]);
  const[search, setSearch] = useState('');
  const [error, setError] = useState<ErrorType | null>(null);
  const[loading, setLoading] = useState(false);
  const[isOpen, setIsOpen] = useState({}) 
  const[isResponseOk, setIsResponseOk] = useState(false);
  const [sortedUsers, setSortedUsers] = useState(users);
  const [sortedOrder, setSortedOrder] = useState('ASC');

  useEffect(() => {
    sortData()
  },[users, search])
  
  const getUsers = async () => {

    setLoading(true);
  
    const header = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
  
    try {
      let response = await UsersApi(header)
  
      setLoading(false);
  
      if(response.status === 200) {
        setUsers(response.data);
      }
      if(response.status === 500) {
        setError({message:'Ups! We have a problems getting the users list'})
      }
      if(response.status === 403) {
        setError({message:'Ups! We found a communication problem with the server'})
      }
      if(response.status === 404) {
        setError({message:'Ups! We didn\'t find the correct link to get the users list'})
      }
    } catch (error) {
      setLoading(false);
      setError({message:'Ups! We found a communication problem with the server, we are no able to display the users list'})
    }
  }

  useEffect(() => {
    getUsers();
  
    let decodedProfileImageUsers: DecodedProfileImageUsersType[] = [];
    if (Array.isArray(users)) {
      decodedProfileImageUsers = users.map((user) => {
        const imageUrl = user.pic;
        const blob = new Blob([imageUrl], { type: 'image/jpeg' });
        const imageUrlObject = URL.createObjectURL(blob);
        return {
          id: user.id,
          name: user.name,
          pic: imageUrlObject,
          email: user.email,
          status: user.status,
          level: user.level,
          address: user.address
        };
      });
    
      setUsers(decodedProfileImageUsers);
    }
  }, [isResponseOk]);
  

  const sortData = (sortBy?: SortByType | any) => {

    let sorted = [...sortedUsers];
    let isNumericSearch = (/^[0-9]+$/).test(search);
    let isSortingByStatus = sortBy === "status";
    let isSortingByEmail = sortBy === "email";
    
    if (isSortingByEmail) {
      sortedOrder === 'ASC' 
      ? sorted.sort((a, b) => a.email.localeCompare(b.email))
      : sorted.sort((b, a) => a.email.localeCompare(b.email))
    } else if (isSortingByStatus) {
      sortedOrder === 'ASC' 
      ? sorted.sort((a, b) => a.status - b.status)
      : sorted.sort((b, a) => a.status - b.status)
    } else if(search.length > 0) {

      if(isNumericSearch){
        sorted = users.filter(elem =>  String(elem.id).includes(String(search))); 
      } else if(!(/^[0-9]+$/).test(search) ){
        sorted = users.filter(elem => elem.name.toLowerCase().includes(search.toLowerCase()))
      }

    } else {
      sorted = [...users];
    }
    setSortedUsers(sorted);
  }



  return (
    <div className={`users
    ${isDark ? 'isDark' : 'isLight'}`
    }>
      <TopMenu title="Users"/>
      <LeftMenu/>
      {loading && <Loader/>}
      
      {(Object.entries(isOpen)).length > 0 && <UsersModal isOpen={isOpen} setIsOpen={setIsOpen} isResponseOk={isResponseOk} setIsResponseOk={setIsResponseOk}  /> }
      <img src={add} alt="add" className="usersList-add" onClick={() => setIsOpen({add: true})}/> 
      <input 
            type="text" 
            className="users-search" 
            placeholder="Search ID or Name"
            onChange={(e) => setSearch( e.target.value)}
          />
      <img src={searchIcon} className="users-searchIcon" alt="search"/>
      <div className="users-main">
        <div className="users-container">
       
        <div className="user-table">
       
            <table>
              <thead>
                <tr>
                  <th>Pic</th>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Email
                  <img src={sort} alt='sort'
                    onClick={() => {
                      setSortedOrder(sortedOrder === "ASC" ? "DESC" : "ASC")
                      sortData("email")}}
                    /> 
                  </th>
                  <th>Address</th>
                  <th>Status
                  <img src={sort} alt='sort'
                    onClick={() => {
                      setSortedOrder(sortedOrder === "ASC" ? "DESC" : "ASC")
                      sortData("status")}}
                    /> 
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>           
                {sortedUsers && sortedUsers.map(user => {
                  return (
                    <tr key={user.id}>
                      <td className="profile-pic-main">
                        <div className="profile-pic-container">
                          <img
                            src={user.pic}
                            alt="profile pic"
                          />
                          <div className={`img-info ${user.level === 'ux/ui' ? 'ux-ui' : user.level}`}>{user.level}</div>
                        </div>
                      </td>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td id="email">{user.email}</td>
                      <td>{user.address}</td>
                      <td>{user.status}</td>
                      <td className='users-action'>
                        <img src={edit} alt="edit"  onClick={() => setIsOpen({edit: true, data: user})} />
                        <img src={trash} alt="trash" onClick={() => setIsOpen({delete: true, data: user})} />
                    
                      </td>   
                    </tr>
                      
                  )
                })}
                
              </tbody>
             
            </table>
            {error && <div className={`${error.message ? 'usersError-message' : '' }`}>{error.message}</div>}
        </div>
        </div>
      </div>
    </div>
  )
  }
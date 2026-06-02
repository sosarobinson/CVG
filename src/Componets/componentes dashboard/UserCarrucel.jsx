import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount } from "../Avatar";
import { Mensageria } from "../Mensajeria/Mensageria";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Constext/AuthToken";
import ChatPopup from "../Mensajeria/Chat";

const UserCarrucel = ({ users, loading = false, datauser, interactive = true }) => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setChatOpen(true);
    setIsMinimized(false);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedUser(null);
  };

  const handleMinimize = () => {
    setChatOpen(false);
    setIsMinimized(true);
  };

  if (loading) return (
    <div className="flex items-center space-x-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
      ))}
    </div>
  );

  return (
    <div className="relative h-fit w-fit  ">
      {/* Grid: 2 columnas. Primera fila: 2 avatares. Segunda fila: tercer avatar + contador */}
      <div className="transition-all flex items-center justify-center">
        <div className={`grid  gap-1 items-center justify-center ${users?.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {/* Primera fila: dos avatares */}
          <div className="flex items-center -space-x-2">
            {users?.[0] && (
              <Avatar
                key={users[0].id || 'u0'}
                size="default"
                onClick={() => interactive && handleSelectUser(users[0])}
                className={`cursor-pointer ${interactive ? 'hover:-translate-y-1 transition-transform' : ''}`}
              >
                <AvatarImage src={users[0].avatar} alt={users[0].name} />
                <AvatarFallback>{users[0].initials}</AvatarFallback>
              </Avatar>
            )}

            {users?.[1] && (
              <Avatar
                key={users[1].id || 'u1'}
                size="default"
                onClick={() => interactive && handleSelectUser(users[1])}
                className={`cursor-pointer ${interactive ? 'hover:-translate-y-1 transition-transform' : ''}`}
              >
                <AvatarImage src={users[1].avatar} alt={users[1].name} />
                <AvatarFallback>{users[1].initials}</AvatarFallback>
              </Avatar>
            )}
          </div>

          {/* placeholder para mantener la estructura */}
          <div className="flex items-center justify-center"></div>

          {/* Segunda fila: tercer avatar + contador (estilo cuadrado) */}
          <div className="col-span-2 ml-2 -mt-2 flex items-center justify-center -space-x-1">
            {users?.[2] && (
              <Avatar
                key={users[2].id || 'u2'}
                size="default"
                onClick={() => interactive && handleSelectUser(users[2])}
                
                className={`cursor-pointer ${interactive ? 'hover:-translate-y-1 transition-transform' : ''}`}
              >
                <AvatarImage src={users[2].avatar} alt={users[2].name} />
                <AvatarFallback>{users[2].initials}</AvatarFallback>
              </Avatar>
            )}

            {users && users.length > 3 && (
              <AvatarGroupCount
                size="default"
                className="rounded-full  text-sm bg-slate-100/60 border border-slate-200 flex items-center justify-center -ml-0"
              >
                +{users.length - 3}
              </AvatarGroupCount>
            )}
          </div>
        </div>
      </div>

      {/* RENDERIZADO DEL CHAT O BURBUJA */}
      {selectedUser && (
        <>
          {chatOpen ? (
            <ChatPopup
              user={selectedUser}
              datauser={datauser}
              onClose={handleCloseChat}
              onMinimize={handleMinimize} // Debes agregar este prop a tu ChatPopup
            />
          ) : isMinimized ? (
            <ChatBubble
              user={selectedUser}

              onClick={() => { setChatOpen(true); setIsMinimized(false); }}
            />
          ) : null}
        </>
      )}
    </div>
  );
};


export default UserCarrucel;
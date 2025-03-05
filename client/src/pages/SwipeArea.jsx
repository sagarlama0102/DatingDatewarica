import React, { useState } from "react";
import TinderCard from "react-tinder-card";
import { useMatchStore } from "../store/useMatchStore";
import { Heart, X, MapPin, Briefcase } from "lucide-react";

const SwipeArea = () => {
  const { userProfiles, swipeRight, swipeLeft } = useMatchStore();
  const [currentIndex, setCurrentIndex] = useState(userProfiles.length - 1);

  const handleSwipe = (dir, user) => {
    if (dir === "right") swipeRight(user);
    else if (dir === "left") swipeLeft(user);
    setCurrentIndex(prevIndex => prevIndex - 1);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-md h-[36rem] mb-4">
        {userProfiles.map((user, index) => (
          <TinderCard
            className="absolute w-full h-full"
            key={user.id}
            onSwipe={(dir) => handleSwipe(dir, user)}
            swipeRequirementType="position"
            swipeThreshold={100}
            preventSwipe={["up", "down"]}
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
              {/* Background image with gradient overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={user.image || "/avatar.png"}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-80"></div>
              </div>

              {/* Content container */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <h2 className="text-3xl font-bold">
                      {user.name}, {user.age}
                    </h2>
                    
                    {user.location && (
                      <div className="flex items-center mt-1 text-gray-200">
                        <MapPin size={16} className="mr-1" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    
                    {user.profession && (
                      <div className="flex items-center mt-1 text-gray-200">
                        <Briefcase size={16} className="mr-1" />
                        <span>{user.profession}</span>
                      </div>
                    )}
                  </div>
                  
                  {index === currentIndex && (
                    <div className="flex gap-3">
                      <button 
                        className="bg-white rounded-full p-4 shadow-md transition-transform hover:scale-105"
                        onClick={() => handleSwipe("left", user)}
                      >
                        <X className="text-red-500" size={24} />
                      </button>
                      <button 
                        className="bg-white rounded-full p-4 shadow-md transition-transform hover:scale-105"
                        onClick={() => handleSwipe("right", user)}
                      >
                        <Heart className="text-green-500" size={24} />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="bg-black bg-opacity-30 p-4 rounded-lg mt-2">
                  <p className="text-gray-100 leading-relaxed">{user.bio}</p>
                  
                  {user.interests && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {user.interests.map((interest, i) => (
                        <span 
                          key={i} 
                          className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>
      
      <div className="text-center text-gray-500">
        {currentIndex < 0 ? (
          <p>No more profiles to display!</p>
        ) : (
          <p>{currentIndex + 1} profiles remaining</p>
        )}
      </div>
    </div>
  );
};

export default SwipeArea;
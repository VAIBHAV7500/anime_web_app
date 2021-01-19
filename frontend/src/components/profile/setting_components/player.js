import React from 'react'

const Player = () => {
    const options = [
        {
            title : "Hide Discussion on Enter"
        }
    ]
    
    return (
        <div>
            {options?.map((item) => (
                <div>
                    <input type="checkbox" name="" id=""/>
                    {item.title}
                </div>
            ))}
        </div>
    )
}

export default Player

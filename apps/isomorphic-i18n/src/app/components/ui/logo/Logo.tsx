import Image from 'next/image'
import React from 'react'
import logo from '@public/orderLogo.png'
import smallLogo from '@public/smallLogo.png'

function Logo({small = false}:{small?: boolean;}) {
  return <>
  <div className={`${small? 'w-8' : 'w-32'}`}>

    <Image width={100} height={70} src={small? smallLogo : logo} className='w-full h-full' alt='ordrat-logo'/>
  </div>
  </>
}

export default Logo
import React from 'react'
import * as Yup from 'yup'

function ContactValidation({lang}:{lang:string}) {
  return Yup.object({
      Whatsapp: Yup.string().required("Whatsapp Number is required")
          .matches(/^\d+$/, lang === 'ar' ? 'رقم الهاتف غير صالح' : 'Invalid phone number'),
          facebook: Yup.string().required("facebook Link is required"),
          insta: Yup.string().required("instgram Link is required"),
          twitter: Yup.string().required("twitter Link is required"),
          // phone:Yup.string().matches(phoneRegExp,"Phone is not Valid").required("Phone is required"),
      })
}

export default ContactValidation
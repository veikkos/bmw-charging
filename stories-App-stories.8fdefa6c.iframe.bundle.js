/*! For license information please see stories-App-stories.8fdefa6c.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[980],{"./src/stories/App.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{CarChargingWithSchedule:()=>CarChargingWithSchedule,CarConnectedNotCharging:()=>CarConnectedNotCharging,CarNotConnected:()=>CarNotConnected,CarNotConnectedWithLevel:()=>CarNotConnectedWithLevel,NoCar:()=>NoCar,NotLoggedIn:()=>NotLoggedIn,ScheduleSetNotCharging:()=>ScheduleSetNotCharging,__namedExportsOrder:()=>__namedExportsOrder,default:()=>App_stories});__webpack_require__("./node_modules/react/index.js");var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const AppUI=_ref=>{let{vin,setVin,startTime,setStartTime,stopTime,setStopTime,message,connected,charging,batteryLevel,schedule,imageSrc,loggedIn,hcaptchaToken,setHcaptchaToken,handleSetHcaptchaToken,handleClearTimers,handleSetTimers,handleOptimize,handleStartCharging,handleStopCharging}=_ref;const cardClasses="bg-card shadow-lg rounded-lg p-6",buttonClasses="px-4 py-2 rounded hover:bg-blue-600",chargingButtonClasses=charging?"bg-blue-600 text-gray-200":"bg-blue-500 text-white",textClasses=charging?"text-gray-200":"text-gray-800",titleClasses="text-xl font-bold mb-4 text-gray-800",smallTextClasses=charging?"text-gray-300":"text-gray-600";return(0,jsx_runtime.jsx)("div",{className:"w-full min-h-screen bg-background flex justify-center py-8",children:(0,jsx_runtime.jsxs)("div",{className:"max-w-lg flex flex-col",children:[(0,jsx_runtime.jsx)("h1",{className:"text-4xl font-bold text-center pb-8",children:"BMW Charging"}),!loggedIn&&(0,jsx_runtime.jsxs)("div",{className:`${cardClasses} bg-warning flex flex-col justify-between`,children:[(0,jsx_runtime.jsx)("h2",{className:titleClasses,children:"Login"}),(0,jsx_runtime.jsxs)("div",{className:"flex flex-row justify-between",children:[(0,jsx_runtime.jsx)("input",{type:"text",placeholder:"hCaptcha token",value:hcaptchaToken,onChange:e=>setHcaptchaToken(e.target.value),className:"border border-gray-300 text-gray-600 p-2 rounded flex-grow mr-4"}),(0,jsx_runtime.jsx)("button",{onClick:()=>handleSetHcaptchaToken(hcaptchaToken),className:`${buttonClasses} bg-blue-500 text-white`,children:"Login"})]})]}),loggedIn&&(0,jsx_runtime.jsx)("div",{className:`${cardClasses} flex flex-col`,children:(0,jsx_runtime.jsx)("input",{type:"text",value:vin,onChange:e=>setVin(e.target.value),placeholder:"VIN or part of the model",className:"border border-gray-300 text-gray-600 p-2 rounded"})}),loggedIn&&imageSrc&&(0,jsx_runtime.jsx)("div",{className:"mt-8",children:(0,jsx_runtime.jsx)("img",{src:imageSrc,alt:"Vehicle",className:"w-full"})}),loggedIn&&vin&&(0,jsx_runtime.jsxs)("div",{className:`${cardClasses} flex flex-row justify-between mt-8 ${charging?"pulse bg-charging":""}`,children:[(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("h2",{className:`text-xl font-bold ${textClasses}`,children:connected?batteryLevel?`Connected (${batteryLevel}%)`:"Connected":batteryLevel?`Not connected (${batteryLevel}%)`:"Not connected"}),loggedIn&&connected&&(0,jsx_runtime.jsx)("p",{className:`text-lg mt-4 ${smallTextClasses}`,children:charging?"Charging":"Not charging"})]}),connected&&(0,jsx_runtime.jsx)("div",{className:"flex flex-col justify-end",children:(0,jsx_runtime.jsx)("button",{onClick:charging?handleStopCharging:handleStartCharging,className:`${buttonClasses} ${chargingButtonClasses}`,children:charging?"Stop":"Start"})})]}),loggedIn&&vin&&(schedule.startTime||schedule.stopTime)&&(0,jsx_runtime.jsxs)("div",{className:`${cardClasses} flex flex-col justify-between mt-8`,children:[(0,jsx_runtime.jsx)("h2",{className:titleClasses,children:"Current schedule"}),(0,jsx_runtime.jsxs)("div",{className:"flex items-center space-x-4 text-gray-600 text-lg",children:[schedule.startTime||"--:--"," ",(0,jsx_runtime.jsx)("p",{className:"text-gray-500 mx-2",children:"-"})," ",schedule.stopTime||"--:--"]}),(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsx)("button",{onClick:handleClearTimers,className:`${buttonClasses} mt-8 bg-blue-500 text-white`,children:"Cancel"})})]}),loggedIn&&vin&&!schedule.startTime&&!schedule.stopTime&&(0,jsx_runtime.jsxs)("div",{className:`${cardClasses} flex flex-col justify-between mt-8`,children:[(0,jsx_runtime.jsx)("h2",{className:titleClasses,children:"Create schedule"}),(0,jsx_runtime.jsxs)("div",{className:"flex items-center space-x-4 text-gray-600",children:[(0,jsx_runtime.jsx)("input",{type:"text",value:startTime,onChange:e=>setStartTime(e.target.value),placeholder:"(hh:mm)",disabled:!vin,className:"w-24 border border-gray-300 p-2 rounded"}),(0,jsx_runtime.jsx)("p",{className:"text-gray-400 mx-2",children:"-"}),(0,jsx_runtime.jsx)("input",{type:"text",value:stopTime,onChange:e=>setStopTime(e.target.value),placeholder:"(hh:mm)",disabled:!vin,className:"w-24 border border-gray-300 p-2 rounded"})]}),(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("button",{onClick:handleSetTimers,className:`${buttonClasses} mt-8 bg-blue-500 text-white`,children:"Set"}),(0,jsx_runtime.jsx)("button",{onClick:handleOptimize,className:`${buttonClasses} mt-8 bg-blue-500 text-white ml-4`,children:"Optimize"})]})]}),message&&(0,jsx_runtime.jsx)("p",{className:"mt-4",children:message})]})})},src_AppUI=AppUI;AppUI.__docgenInfo={description:"",methods:[],displayName:"AppUI"};const appUIStory={title:"AppUI",component:src_AppUI},mockHandlers={handleClearTimers:()=>alert("Clearing timers..."),handleSetTimers:()=>alert("Setting timers..."),handleOptimize:()=>alert("Optimizing..."),handleStartCharging:()=>alert("Starting charging..."),handleStopCharging:()=>alert("Stopping charging..."),handleSetHcaptchaToken:()=>alert("Setting hCaptcha token...")},Template=args=>(0,jsx_runtime.jsx)(src_AppUI,{...args,...mockHandlers}),NoCar=Template.bind({});NoCar.args={vin:"",startTime:"",stopTime:"",message:"",connected:!1,charging:!1,batteryLevel:0,schedule:{startTime:"",stopTime:""},imageSrc:"",prices:[],hcaptchaToken:"",loggedIn:!0};const CarNotConnected=Template.bind({});CarNotConnected.args={vin:"123456789",startTime:"",stopTime:"",message:"",connected:!1,charging:!1,batteryLevel:0,schedule:{startTime:"",stopTime:""},imageSrc:"https://via.placeholder.com/300",prices:[],hcaptchaToken:"",loggedIn:!0};const CarNotConnectedWithLevel=Template.bind({});CarNotConnectedWithLevel.args={vin:"123456789",startTime:"",stopTime:"",message:"",connected:!1,charging:!1,batteryLevel:50,schedule:{startTime:"",stopTime:""},imageSrc:"https://via.placeholder.com/300",prices:[],hcaptchaToken:"",loggedIn:!0};const CarChargingWithSchedule=Template.bind({});CarChargingWithSchedule.args={vin:"123456789",startTime:"08:00",stopTime:"12:00",message:"",connected:!0,charging:!0,batteryLevel:80,schedule:{startTime:"",stopTime:"12:00"},imageSrc:"https://via.placeholder.com/300",prices:[],hcaptchaToken:"",loggedIn:!0};const CarConnectedNotCharging=Template.bind({});CarConnectedNotCharging.args={vin:"123456789",startTime:"",stopTime:"",message:"",connected:!0,charging:!1,batteryLevel:60,schedule:{startTime:"",stopTime:""},imageSrc:"https://via.placeholder.com/300",prices:[],hcaptchaToken:"",loggedIn:!0};const ScheduleSetNotCharging=Template.bind({});ScheduleSetNotCharging.args={vin:"123456789",startTime:"10:00",stopTime:"14:00",message:"",connected:!0,charging:!1,batteryLevel:50,schedule:{startTime:"10:00",stopTime:"14:00"},imageSrc:"https://via.placeholder.com/300",prices:[],hcaptchaToken:"",loggedIn:!0};const NotLoggedIn=Template.bind({});NotLoggedIn.args={vin:"123456789",startTime:"",stopTime:"",message:"",connected:!1,charging:!1,batteryLevel:0,schedule:{startTime:"",stopTime:""},imageSrc:"https://via.placeholder.com/300",prices:[],hcaptchaToken:"",loggedIn:!1};const App_stories=appUIStory,__namedExportsOrder=["NoCar","CarNotConnected","CarNotConnectedWithLevel","CarChargingWithSchedule","CarConnectedNotCharging","ScheduleSetNotCharging","NotLoggedIn"];NoCar.parameters={...NoCar.parameters,docs:{...NoCar.parameters?.docs,source:{originalSource:"args => <AppUI {...args} {...mockHandlers} />",...NoCar.parameters?.docs?.source}}},CarNotConnected.parameters={...CarNotConnected.parameters,docs:{...CarNotConnected.parameters?.docs,source:{originalSource:"args => <AppUI {...args} {...mockHandlers} />",...CarNotConnected.parameters?.docs?.source}}},CarNotConnectedWithLevel.parameters={...CarNotConnectedWithLevel.parameters,docs:{...CarNotConnectedWithLevel.parameters?.docs,source:{originalSource:"args => <AppUI {...args} {...mockHandlers} />",...CarNotConnectedWithLevel.parameters?.docs?.source}}},CarChargingWithSchedule.parameters={...CarChargingWithSchedule.parameters,docs:{...CarChargingWithSchedule.parameters?.docs,source:{originalSource:"args => <AppUI {...args} {...mockHandlers} />",...CarChargingWithSchedule.parameters?.docs?.source}}},CarConnectedNotCharging.parameters={...CarConnectedNotCharging.parameters,docs:{...CarConnectedNotCharging.parameters?.docs,source:{originalSource:"args => <AppUI {...args} {...mockHandlers} />",...CarConnectedNotCharging.parameters?.docs?.source}}},ScheduleSetNotCharging.parameters={...ScheduleSetNotCharging.parameters,docs:{...ScheduleSetNotCharging.parameters?.docs,source:{originalSource:"args => <AppUI {...args} {...mockHandlers} />",...ScheduleSetNotCharging.parameters?.docs?.source}}},NotLoggedIn.parameters={...NotLoggedIn.parameters,docs:{...NotLoggedIn.parameters?.docs,source:{originalSource:"args => <AppUI {...args} {...mockHandlers} />",...NotLoggedIn.parameters?.docs?.source}}}},"./node_modules/react/cjs/react-jsx-runtime.production.min.js":(__unused_webpack_module,exports,__webpack_require__)=>{var f=__webpack_require__("./node_modules/react/index.js"),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};function q(c,a,g){var b,d={},e=null,h=null;for(b in void 0!==g&&(e=""+g),void 0!==a.key&&(e=""+a.key),void 0!==a.ref&&(h=a.ref),a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}exports.Fragment=l,exports.jsx=q,exports.jsxs=q},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.min.js")}}]);
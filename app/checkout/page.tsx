'use client'
import {Fragment, useEffect, useRef, useState} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {Overlay} from "next/dist/client/components/react-dev-overlay/internal/components/Overlay";
import {useRouter, useSearchParams} from "next/navigation";
import axios from "axios";
import {BASE_HOST} from "@/config";

type Product = {
    _id: any,
    serialNumber: number,
    name: string,
    amount: number,
    thumbnail: string
}

export default function Checkout() {
    const [showModal, setShowModal] = useState(false)
    const [modalConfig, setModalConfig] = useState({
        title: '',
        contents: ''
    })
    const cancelButtonRef = useRef(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [teamName, setTeamName] = useState('')
    const [email, setEmail] = useState('')
    const [products, setProducts] = useState<Product[]>([])
    const searchParams = useSearchParams()
    const [receiver, setReceiver] = useState('')
    const [address, setAddress] = useState('')
    const [receiverPhoneNumber, setReceiverPhoneNumber] = useState('')
    const [sendEmail, setSendEmail] = useState(false)
    const [sendVerificationCode, setSendVerificationCode] = useState(false)
    const [verificationCode, setVerificationCode] = useState('')
    const [seconds, setSeconds] = useState(0)
    const router = useRouter()

    const showAlert = (title: string, contents: string) => {
        setModalConfig({
            title,
            contents
        })
        setShowModal(true)
    }
    const getCode = async () => {
        if (!email) {
            showAlert('错误', '请输入正确的邮箱')
            return
        }
        try {
            setLoading(true)
            const data = await fetch(`${BASE_HOST}/api/v1/code?email=` + email).then(res => res.json())
            if (data) {
                setLoading(false)
            }
            if (data.messageId) {
                showAlert('发送成功', '验证码已发送至您的邮箱，请注意查收')
            } else {
                showAlert('发送失败', data.message)
            }
        } catch (e) {
            showAlert('载入失败', e as string)
            console.log(e)
            setLoading(false)
        }
        setLoading(false)
        setSeconds(60)
        const interval = setInterval(() => {
            setSeconds(seconds => seconds - 1)
        }, 1000)
        setTimeout(() => {
            clearInterval(interval)
        }, 60000)
    }
    const submit = async () => {
        if (receiver === '' || email === '' || verificationCode === '' || address === '' || receiverPhoneNumber === '' || teamName === '' || phoneNumber === '' || receiverPhoneNumber === '') {
            showAlert('错误', '请填写完整信息')
            return
        }
        if (!sendEmail && !sendVerificationCode) {
            showAlert('错误', '请选择一种联系方式')
            return
        }
        try {
            let d = {
                receiverName: receiver,
                email,
                address,
                teamName,
                teamPhoneNumber: phoneNumber,
                receiverPhoneNumber,
                sendEmail,
                sendVerificationCode,
                verificationCode,
                products: searchParams.get('_ids')
            }
            const data = await axios.post(`${BASE_HOST}/api/v1/checkout`, d)
            if (data.status) {
                showAlert('谢谢您！', '申请表已提交，您将在3秒后被重定向至首页。')
                setTimeout(() => {
                    router.push('/')
                }, 1000 * 3)
            } else {
                showAlert('发生错误', data.data.message)
            }
        } catch (e) {
            if (e) {
                showAlert('载入失败', '请检查网络连接')
                console.log(e)
            }
        }
    }

    useEffect(() => {
        (async () => {
            try {
                setTeamName(searchParams.get('tn') as string)
                setPhoneNumber(searchParams.get('pn') as string)
                let _idArray: string[] = []
                _idArray = searchParams.get('_ids')?.split(',') as string[]
                _idArray.length = _idArray.length - 1
                const data = await fetch(`${BASE_HOST}/api/v1/product`).then(res => res.json())
                if (data) {
                    let selectedProducts: Product[] = []
                    for (let i = 0; i < _idArray.length; i++) {
                        for (let j = 0; j < data.length; j++) {
                            if (_idArray[i] === data[j]._id) {
                                selectedProducts.push(data[j])
                            }
                        }
                    }
                    setProducts(selectedProducts)
                    setLoading(false)
                }
            } catch (e) {
                if (e) {
                    showAlert('载入失败', '请检查网络连接')
                }
                setLoading(false)
            }
            setLoading(false)
        })()
    }, []);

    useEffect(() => {
        console.clear()
        console.log(`

__/\\\\\\\\____________/\\\\\\\\____________________________________/\\\\\\\\\\\\\\\\\\\\\\\\\\_____________________________________________________________________________________        
 _\\/\\\\\\\\\\\\________/\\\\\\\\\\\\________/\\\\\\_______________________\\/\\\\\\/////////\\\\\\___________________________________/\\\\\\____________________________________________       
  _\\/\\\\\\//\\\\\\____/\\\\\\//\\\\\\__/\\\\\\_\\/\\\\\\_______________________\\/\\\\\\_______\\/\\\\\\__________________________________\\///___________________________________/\\\\\\______      
   _\\/\\\\\\\\///\\\\\\/\\\\\\/_\\/\\\\\\_\\///__\\/\\\\\\\\\\\\\\\\_____/\\\\\\____/\\\\\\_\\/\\\\\\\\\\\\\\\\\\\\\\\\\\/___/\\\\/\\\\\\\\\\\\\\______/\\\\\\\\\\__________/\\\\\\_____/\\\\\\\\\\\\\\\\______/\\\\\\\\\\\\\\\\__/\\\\\\\\\\\\\\\\\\\\\\_     
    _\\/\\\\\\__\\///\\\\\\/___\\/\\\\\\__/\\\\\\_\\/\\\\\\////\\\\\\__\\/\\\\\\___\\/\\\\\\_\\/\\\\\\/////////____\\/\\\\\\/////\\\\\\___/\\\\\\///\\\\\\_______\\/\\\\\\___/\\\\\\/////\\\\\\___/\\\\\\//////__\\////\\\\\\////__    
     _\\/\\\\\\____\\///_____\\/\\\\\\_\\/\\\\\\_\\/\\\\\\\\\\\\\\\\/___\\/\\\\\\___\\/\\\\\\_\\/\\\\\\_____________\\/\\\\\\___\\///___/\\\\\\__\\//\\\\\\______\\/\\\\\\__/\\\\\\\\\\\\\\\\\\\\\\___/\\\\\\____________\\/\\\\\\______   
      _\\/\\\\\\_____________\\/\\\\\\_\\/\\\\\\_\\/\\\\\\///\\\\\\___\\/\\\\\\___\\/\\\\\\_\\/\\\\\\_____________\\/\\\\\\_________\\//\\\\\\__/\\\\\\___/\\\\_\\/\\\\\\_\\//\\\\///////___\\//\\\\\\___________\\/\\\\\\_/\\\\__  
       _\\/\\\\\\_____________\\/\\\\\\_\\/\\\\\\_\\/\\\\\\_\\///\\\\\\_\\//\\\\\\\\\\\\\\\\\\__\\/\\\\\\_____________\\/\\\\\\__________\\///\\\\\\\\\\/___\\//\\\\\\\\\\\\___\\//\\\\\\\\\\\\\\\\\\\\__\\///\\\\\\\\\\\\\\\\____\\//\\\\\\\\\\___ 
        _\\///______________\\///__\\///__\\///____\\///___\\/////////___\\///______________\\///_____________\\/////______\\//////_____\\//////////_____\\////////______\\/////____
__/\\\\\\\\\\\\\\\\\\\\\\\\\\___________________________________________________________________________________________________________                                            
 _\\/\\\\\\/////////\\\\\\_________________________________________________________________________________________________________                                           
  _\\/\\\\\\_______\\/\\\\\\____________________________________________________________________________/\\\\\\_________________________                                          
   _\\/\\\\\\\\\\\\\\\\\\\\\\\\\\/___/\\\\/\\\\\\\\\\\\\\______/\\\\\\\\\\\\\\\\___/\\\\\\\\\\\\\\\\\\\\_____/\\\\\\\\\\\\\\\\___/\\\\/\\\\\\\\\\\\____/\\\\\\\\\\\\\\\\\\\\\\__/\\\\\\\\\\\\\\\\\\\\_______                                         
    _\\/\\\\\\/////////____\\/\\\\\\/////\\\\\\___/\\\\\\/////\\\\\\_\\/\\\\\\//////____/\\\\\\/////\\\\\\_\\/\\\\\\////\\\\\\__\\////\\\\\\////__\\/\\\\\\//////________                                        
     _\\/\\\\\\_____________\\/\\\\\\___\\///___/\\\\\\\\\\\\\\\\\\\\\\__\\/\\\\\\\\\\\\\\\\\\\\__/\\\\\\\\\\\\\\\\\\\\\\__\\/\\\\\\__\\//\\\\\\____\\/\\\\\\______\\/\\\\\\\\\\\\\\\\\\\\_______                                       
      _\\/\\\\\\_____________\\/\\\\\\_________\\//\\\\///////___\\////////\\\\\\_\\//\\\\///////___\\/\\\\\\___\\/\\\\\\____\\/\\\\\\_/\\\\__\\////////\\\\\\_______                                      
       _\\/\\\\\\_____________\\/\\\\\\__________\\//\\\\\\\\\\\\\\\\\\\\__/\\\\\\\\\\\\\\\\\\\\__\\//\\\\\\\\\\\\\\\\\\\\_\\/\\\\\\___\\/\\\\\\____\\//\\\\\\\\\\____/\\\\\\\\\\\\\\\\\\\\__/\\\\\\_                                     
        _\\///______________\\///____________\\//////////__\\//////////____\\//////////__\\///____\\///______\\/////____\\//////////__\\///__                                    

`)
    }, []);

    return <>
        <div className="space-y-12 mx-10 my-10">
            <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">邮寄信息</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">请仔细填写并核对下述信息</p>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                            收件人姓名
                        </label>
                        <div className="mt-2">
                            <input
                                onChange={(e) => setReceiver(e.target.value)}
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                            邮箱
                        </label>
                        <div className="mt-2">
                            <input
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                            邮箱验证码
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        {
                            seconds === 0 ?
                                <div
                                    onClick={() => getCode()}
                                    className="cursor-pointer mt-4 block mb-10 w-full rounded-md bg-indigo-600 px-2 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    获取验证码
                                </div> :
                                <div
                                    className="cursor-pointer mt-4 block mb-10 w-full rounded-md bg-indigo-600 px-2 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    还有{seconds}秒
                                </div>
                        }
                    </div>
                    <div className="col-span-full">
                        <label htmlFor="street-address"
                               className="block text-sm font-medium leading-6 text-gray-900">
                            地址
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                onChange={(e) => setAddress(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2 sm:col-start-1">
                        <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                            您的小队名
                        </label>
                        <div className="mt-2">
                            <input
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                type="text"
                                required
                                disabled
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                            您的小队的手机号
                        </label>
                        <div className="mt-2">
                            <input
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                type="text"
                                required
                                disabled
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                            收件人手机号
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                onChange={(e) => setReceiverPhoneNumber(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">审核通知结果推送</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                    您提交硬件配送申请后，我们会对您的信息进行审核，您需要选择通过哪些方式告诉您审核结果。
                </p>

                <div className="mt-10 space-y-10">
                    <fieldset>
                        <div className="mt-6 space-y-6">
                            <div className="relative flex gap-x-3">
                                <div className="flex h-6 items-center">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => setSendEmail(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                </div>
                                <div className="text-sm leading-6">
                                    <label htmlFor="comments" className="font-medium text-gray-900">
                                        发邮件给我(推荐)
                                    </label>
                                    <p className="text-gray-500">当审核完毕后，您会收到记有审核结果的邮件（请记得检查垃圾邮件）。</p>
                                </div>
                            </div>
                            {/*<div className="relative flex gap-x-3">*/}
                            {/*    <div className="flex h-6 items-center">*/}
                            {/*        <input*/}
                            {/*            type="checkbox"*/}
                            {/*            onChange={(e) => setSendVerificationCode(e.target.checked)}*/}
                            {/*            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*    <div className="text-sm leading-6">*/}
                            {/*        <label htmlFor="candidates" className="font-medium text-gray-900">*/}
                            {/*            发短信给我*/}
                            {/*        </label>*/}
                            {/*        <p className="text-gray-500">当审核通过后，您会收到记有结果的短信。</p>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    </fieldset>
                </div>
            </div>
            <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">检查单</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                    再次确认您所选择的商品，然后点击下方的确认以提交。
                </p>
                <div className="mt-8">
                    <div className="flow-root">
                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {products.map((product) => (
                                <li key={product._id + '_' + Math.random() + 100} className="flex py-6">
                                    <div
                                        className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        <img
                                            src={product.thumbnail}
                                            alt={product.thumbnail}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                        <div>
                                            <div className="text-base font-medium text-gray-900 sm:flex sm:justify-between">
                                                <h3>{product.name}</h3>
                                                <p className="ml-4">_id {product._id}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">1件 / 壹件</p>
                                        </div>
                                        <div className="flex flex-1 items-end justify-between text-sm">
                                            <p className="text-gray-500">{'ID ' + product.serialNumber}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6 mb-10 mx-10">
            <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                回首页
            </button>
            <button
                onClick={() => submit()}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                确认
            </button>
        </div>
        <Transition.Root show={loading}>
            <Overlay className="relative z-50">
                <Transition.Child
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                </Transition.Child>
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div
                        className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 rounded box-border">
                                <div className="sm:flex sm:items-start">
                                    <div className="text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                                            数据正在载入，请稍等...
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Overlay>
        </Transition.Root>
        <Transition.Root show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-50" initialFocus={cancelButtonRef} onClose={setShowModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div
                        className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title as="h3"
                                                          className="text-base font-semibold leading-6 text-gray-900">
                                                {modalConfig.title}
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    {modalConfig.contents}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                        onClick={() => setShowModal(false)}
                                    >
                                        好
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => setShowModal(false)}
                                    >
                                        取消
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    </>
}

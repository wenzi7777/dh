'use client'
import {Fragment, useEffect, useRef, useState} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {Overlay} from "next/dist/client/components/react-dev-overlay/internal/components/Overlay";
import {useRouter, useSearchParams} from "next/navigation";
import axios from "axios";
import {atob} from "buffer";
import {Orbit} from "next/dist/compiled/@next/font/dist/google";

type Product = {
    _id: any,
    serialNumber: number,
    name: string,
    amount: number,
    thumbnail: string
}
type Order = {
    _id: any,
    receiverName: string,
    email: string,
    address: string,
    teamName: string,
    teamPhoneNumber: string,
    receiverPhoneNumber: string,
    sendEmail: boolean,
    products: Product[],
    updatedAt: any,
    createdAt: any,
    approved: string
}

export default function Admin() {
    const [showModal, setShowModal] = useState(false)
    const [modalConfig, setModalConfig] = useState({
        title: '',
        contents: ''
    })
    const cancelButtonRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState('')
    const router = useRouter()
    const [authenticated, setAuthenticated] = useState(false)
    const [orders, setOrders] = useState<Order[]>()
    const [page, setPage] = useState(1)
    const [keyword, setKeyword] = useState('')
    const [totalPage, setTotalPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)

    const showAlert = (title: string, contents: string) => {
        setModalConfig({
            title,
            contents
        })
        setShowModal(true)
    }
    const verifyToken = async () => {
        if (!token) {
            showAlert('错误', '您需要输入Token')
            return
        }
        try {
            setLoading(true)
            const data = await fetch('https://openapis.dflylabs.ltd:23333/api/v1/admin/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token
                })
            }).then(res => res.json())
            if (data) {
                setLoading(false)
            }
            if (data.isVerified) {
                setAuthenticated(true)
                localStorage.setItem('token', btoa(token))
                search()
            } else {
                showAlert('验证失败', '您的Token有错。')
            }
        } catch (e) {
            showAlert('载入失败', e as string)
            console.log(e)
            setLoading(false)
        }
        setLoading(false)
    }
    const search = async () => {
        try {
            setLoading(true)
            const data = await fetch(`https://openapis.dflylabs.ltd:23333/api/v1/admin/search?field=teamName&keyword=${keyword}&page=${page}&limit=16&token=${window.atob(localStorage.getItem('token') as string)}`).then(res => res.json())
            if (data) {
                setLoading(false)
            }
            if (data.raw) {
                setOrders(data.raw.data)
                setTotalPage(data.raw.totalPage)
                setPage(data.raw.current)
                setTotalCount(data.raw.totalCount)
            } else {
                showAlert('查找失败', data.message)
            }
        } catch (e) {
            showAlert('载入失败', e as string)
            setLoading(false)
        }
        setLoading(false)
    }
    const approve = async (_id: any, order: Order, sendEmail: boolean, email: string) => {
        try {
            setLoading(true)
            const data = await fetch('https://openapis.dflylabs.ltd:23333/api/v1/admin/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    newStatus: 'approved',
                    _id,
                    sendEmail,
                    email
                })
            }).then(res => res.json())
            if (data) {
                let newOrder = order
                newOrder.approved = 'approved'
                let newOrders = orders as any
                if (newOrders) {
                    // @ts-ignore
                    newOrders[orders.indexOf(order)] = newOrder
                }
                setOrders(newOrders)
            }
        } catch (e) {
            showAlert('载入失败', e as string)
            console.log(e)
            setLoading(false)
        }
        setLoading(false)
    }
    const unapprove = async (_id: any, order: Order, sendEmail: boolean, email: string) => {
        try {
            setLoading(true)
            const data = await fetch('https://openapis.dflylabs.ltd:23333/api/v1/admin/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    newStatus: 'unapproved',
                    _id,
                    sendEmail,
                    email
                })
            }).then(res => res.json())
            if (data) {
                let newOrder = order
                newOrder.approved = 'unapproved'
                let newOrders = orders as any
                if (newOrders) {
                    // @ts-ignore
                    newOrders[orders.indexOf(order)] = newOrder
                }
                setOrders(newOrders)
            }
        } catch (e) {
            showAlert('载入失败', e as string)
            console.log(e)
            setLoading(false)
        }
        setLoading(false)
    }
    const seeAllUnApproved = async () => {
        try {
            setLoading(true)
            const data = await fetch(`https://openapis.dflylabs.ltd:23333/api/v1/admin/search?field=approved&keyword=unapproved&page=${page}&limit=16&token=${window.atob(localStorage.getItem('token') as string)}`).then(res => res.json())
            if (data) {
                setLoading(false)
            }
            if (data.raw) {
                setOrders(data.raw.data)
                setTotalPage(data.raw.totalPage)
                setPage(data.raw.current)
                setTotalCount(data.raw.totalCount)
            } else {
                showAlert('查找失败', data.message)
            }
        } catch (e) {
            showAlert('载入失败', e as string)
            setLoading(false)
        }
        setLoading(false)
    }
    const seeAllApproved = async () => {
        try {
            setLoading(true)
            const data = await fetch(`https://openapis.dflylabs.ltd:23333/api/v1/admin/search?field=approved&keyword=approved&page=${page}&limit=16&token=${window.atob(localStorage.getItem('token') as string)}`).then(res => res.json())
            if (data) {
                setLoading(false)
            }
            if (data.raw) {
                setOrders(data.raw.data)
                setTotalPage(data.raw.totalPage)
                setPage(data.raw.current)
                setTotalCount(data.raw.totalCount)
            } else {
                showAlert('查找失败', data.message)
            }
        } catch (e) {
            showAlert('载入失败', e as string)
            setLoading(false)
        }
        setLoading(false)
    }
    const seeAll = async () => {
        try {
            setLoading(true)
            const data = await fetch(`https://openapis.dflylabs.ltd:23333/api/v1/admin/search?field=&keyword=&page=${page}&limit=16&token=${window.atob(localStorage.getItem('token') as string)}`).then(res => res.json())
            if (data) {
                setLoading(false)
            }
            if (data.raw) {
                setOrders(data.raw.data)
                setTotalPage(data.raw.totalPage)
                setPage(data.raw.current)
                setTotalCount(data.raw.totalCount)
            } else {
                showAlert('查找失败', data.message)
            }
        } catch (e) {
            showAlert('载入失败', e as string)
            setLoading(false)
        }
        setLoading(false)
    }
    const previousPage = async () => {
        if(page <= 1) {
            showAlert('错误', '已经是第一页了。')
            return
        }
        setPage(page - 1)
        await search()
    }
    const nextPage = async () => {
        if(page >= totalPage) {
            showAlert('错误', '已经是最后一页了。')
            return
        }
        setPage(page - 1)
        await search()
    }

    useEffect(() => {
        localStorage.removeItem('token')
        setAuthenticated(false)
    }, []);

    return <>
        <div className="mx-10 my-10">
            {
                !authenticated &&
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">控制台</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">需要Token以继续</p>
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                            TOKEN
                        </label>
                        <div className="mt-2">
                            <input
                                type="email"
                                onChange={(e) => setToken(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <div
                            onClick={() => verifyToken()}
                            className="cursor-pointer mt-4 block mb-10 w-full rounded-md bg-indigo-600 px-2 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            好
                        </div>
                    </div>
                </div>
            }
            {
                authenticated && <>
                    <h1 className="text-center text-4xl text-indigo-500 font-bold mb-10">控制台</h1>
                    <div className="flex justify-center items-center gap-1 mb-1">
                        <div
                            onClick={() => seeAllUnApproved()}
                            className="cursor-pointer block w-full rounded-md bg-indigo-600 px-2 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            查询所有驳回的订单
                        </div>
                        <div
                            onClick={() => seeAllApproved()}
                            className="cursor-pointer block w-full rounded-md bg-indigo-600 px-2 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            查询所有通过的订单
                        </div>
                        <div
                            onClick={() => seeAll()}
                            className="cursor-pointer block w-full rounded-md bg-indigo-600 px-2 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            查询所有订单
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-1">
                        <div
                            onClick={() => previousPage()}
                            className="cursor-pointer block w-full rounded-md bg-indigo-600 px-2 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            上一页
                        </div>
                        <div
                            onClick={() => nextPage()}
                            className="cursor-pointer block w-full rounded-md bg-indigo-600 px-2 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            下一页
                        </div>
                        <div
                            className="block w-full rounded-md bg-indigo-600 px-2 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <input type="text" name="pageNumber" id="pageNumber"
                                   value={page ? page : 1}
                                   onChange={e => setPage(parseInt(e.target.value))}
                                   className="text-center w-20 inline py-0 border-0 bg-transparent text-white placeholder:text-white focus:ring-0 sm:text-sm"
                                   placeholder="页面"/> /&nbsp;&nbsp;&nbsp;{totalPage}
                        </div>
                        <div
                            onClick={() => search()}
                            className="cursor-pointer block w-full rounded-md bg-indigo-600 px-2 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            前往输入的页面
                        </div>
                    </div>
                    <p className="text-sm flex justify-start my-3">共{totalCount}个结果</p>
                    <div className="flex-col gap-5 py-5">
                        <ul>
                            {
                                orders?.map((order, index) => <>
                                    <li className="bg-indigo-50 mb-10 px-10 py-5 rounded" key={index + Math.random() * 100}>
                                        <h2 className="text-base font-semibold leading-7 text-gray-900">订单号：{order._id}</h2>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">创建于：{order.createdAt}</p>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">更新于：{order.updatedAt}</p>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">接受人：{order.receiverName}</p>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">接受人电话：{order.receiverPhoneNumber}</p>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">接受人地址：{order.address}</p>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">团队名：{order.teamName}</p>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">团队电话：{order.teamPhoneNumber}</p>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">是否要发送邮件通知：{order.sendEmail + ''}</p>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">目前状态：{order.approved}</p>
                                        <div className="mt-8">
                                            <div className="flow-root">
                                                <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                    {order.products.map((product) => (
                                                        <li key={product._id + '_' + Math.random() + 100}
                                                            className="flex py-6">
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
                                                                    <div
                                                                        className="flex justify-between text-base font-medium text-gray-900">
                                                                        <h3>{product.name}</h3>
                                                                        <p className="ml-4">_id {product._id}</p>
                                                                    </div>
                                                                    <p className="mt-1 text-sm text-gray-500">1件 / 壹件</p>
                                                                </div>
                                                                <div
                                                                    className="flex flex-1 items-end justify-between text-sm">
                                                                    <p className="text-gray-500">{'ID ' + product.serialNumber}</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 mt-5">
                                            <div
                                                onClick={() => approve(order._id, order, order.sendEmail, order.email)}
                                                className="cursor-pointer block w-full rounded-md bg-indigo-600 px-2 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            >
                                                改为通过(若订单提交者设定了需要邮件提醒，通过的信息会被自动发送)
                                            </div>
                                            <div
                                                onClick={() => unapprove(order._id, order, order.sendEmail, order.email)}
                                                className="cursor-pointer block w-full rounded-md bg-indigo-600 px-2 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            >
                                                改为不通过(若订单提交者设定了需要邮件提醒，不通过的信息会被自动发送)
                                            </div>
                                        </div>
                                    </li>
                                </>)
                            }
                        </ul>
                    </div>
                    <p className="text-sm italic flex justify-end">Powered by theMikuWorks</p>
                </>
            }
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

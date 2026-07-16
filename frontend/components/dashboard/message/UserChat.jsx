"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './UserChat.module.css';

const UserChat = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isEmojiListFootVisible, setIsEmojiListFootVisible] = useState(false); // الآن نجعلها تعمل طبيعي
  const [currentMessage, setCurrentMessage] = useState("");
  const [recentEmojis, setRecentEmojis] = useState(['😊', '❤️', '👍', '🔥', '✨', '💯', '🎉', '🥰']);
  const [emojiTimeout, setEmojiTimeout] = useState(null);



  const handleSearchToggle = () => {
    setIsChatVisible(!isChatVisible);
  };

  const handleSearchClose = () => {
    setIsChatVisible(false);
    setSearchValue("");
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value.toLowerCase());
  };

  const toggleEmojiListFoot = () => {
    setIsEmojiListFootVisible(!isEmojiListFootVisible);
  };

  // قائمة الإيموجي المنظمة والمطوّرة بشكل احترافي
  const emojis = [
    // الوجوه الأساسية والمشاعر الإيجابية
    '😊', '😂', '🥰', '😍', '🤗', '😎', '🤔', '😌', 
    '😉', '😄', '😃', '😁', '🙂', '🙃', '😇', '🤩',
    '😋', '😛', '😜', '🤪', '😝', '🤑', '🤭', '🤫',
    '🤓', '🧐', '🤨', '😏', '😒', '🙄', '😬', '🤐',
    
    // القلوب والحب
    '❤️', '💙', '💚', '💛', '🧡', '💜', '🖤', '💕',
    '💖', '💗', '💓', '💘', '💝', '💟', '♥️', '💔',
    '❣️', '💋', '💌', '💐', '🌹', '🌺', '🌻', '🌷',
    
    // الإيماءات والأيدي
    '👍', '👎', '👌', '✌️', '🤝', '🙏', '👏', '💪',
    '👊', '✊', '🤛', '🤜', '🤞', '🤟', '🤘', '🤙',
    '👋', '🤚', '🖐️', '✋', '🖖', '👈', '👉', '👆',
    
    // رموز النجاح والاحتفال
    '🎉', '✨', '⭐', '🏆', '🎯', '💯', '🔥', '⚡',
    '🎊', '🎈', '🎁', '💎', '🌟', '💡', '🚀', '🎖️',
    '🏅', '🎗️', '🎀', '🎂', '🍾', '🥂', '🍻', '🎵',
    
    // الطعام والشراب
    '☕', '🍕', '🍔', '🌮', '🍰', '🍎', '🍊', '🍇',
    '🥑', '🥕', '🌶️', '🍯', '🧀', '🥖', '🥯', '🧈',
    
    // الحيوانات اللطيفة
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐸', '🐵', '🐧', '🦋', '🐝',
    
    // الطبيعة والطقس
    '🌈', '☀️', '🌙', '⭐', '🌸', '🌊', '🏔️', '🔥',
    '❄️', '⛄', '🌡️', '💨', '☁️', '⛈️', '🌩️', '⚡',
    
    // الأنشطة والرياضة
    '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱',
    '🏓', '🏸', '🥊', '🎮', '🎲', '🎯', '🎪', '🎭',
    
    // السفر والنقل
    '✈️', '🚗', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑',
    '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵',
    
    // الرموز والأشكال
    '💫', '⭐', '🌟', '✨', '⚡', '💥', '💢', '💦',
    '💨', '🕳️', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '🔥'
  ];

  const handleEmojiClick = (emoji) => {
    // إغلاق نافذة الإيموجي فوراً أولاً
    setIsEmojiListFootVisible(false);
    
    // تحديث React state مباشرة
    setCurrentMessage(prevMessage => prevMessage + emoji);
    
    // إضافة الإيموجي إلى قائمة الحديثة
    setRecentEmojis(prev => {
      const newRecent = [emoji, ...prev.filter(e => e !== emoji)].slice(0, 8);
      return newRecent;
    });
    
    // التركيز على حقل الإدخال بعد تحديث الـ state
    setTimeout(() => {
      const input = document.querySelector('.chat-input');
      if (input) {
        input.focus();
        // وضع المؤشر في النهاية
        const length = input.value.length;
        if (input.setSelectionRange) {
          input.setSelectionRange(length, length);
        }
      }
    }, 50);
  };



    return (
    <div>

        
      {/* Page Wrapper */}
      <div className="content">
        <div className="container">
          <div className="customer-chat">
            <div className="header-navigation">
              <Link href="/dashboard" className="d-inline-flex align-items-center">
                <i className="isax isax-arrow-left me-2" />
                Back to Dashboard
              </Link>
            </div>
            <div className="row chat-window">
              {/* Chat User List */}
              <div className="col-lg-4 chat-cont-left">
                <div className="card mb-0 flex-fill">
                  <div className="chat-header">
                    <div className="mb-3">
                      <h6>Chats</h6>
                    </div>
                    <div className="input-icon">
                      <span className="input-icon-addon">
                        <i className="isax isax-search-normal-14" />
                      </span>
                      <input
                        type="email"
                        className="form-control form-control-md"
                        placeholder="Search"
                        value={searchValue}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                  <div className="card-body chat-users-list chat-scroll pt-0">
                    <Link
                      href="#"
                      className="d-flex justify-content-between chat-member mb-3"
                    >
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-lg online flex-shrink-0 me-2">
                          <Image
                            src="/img/users/user-08.jpg"
                            alt="User Image"
                            width={50}
                            height={50}
                            className="rounded"
                          />
                        </div>
                        <div>
                          <h6 className="fs-16 fw-medium mb-1">Beth Williams</h6>
                          <p className="fs-14 d-flex align-items-center">
                            <i className="isax isax-image5 me-1" />
                            Image
                          </p>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="text-end">
                          <p className="mb-1 fs-14 text-gray-6">20/03/24</p>
                          <div className="d-flex align-items-center justify-content-end">
                            <i className="fa-solid fa-check" />
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    <Link
                      href="#"
                      className="d-flex justify-content-between chat-member mb-3"
                    >
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-lg flex-shrink-0 me-2">
                          <Image
                            src="/img/users/user-29.jpg"
                            alt="User Image"
                            width={50}
                            height={50}
                            className="rounded"
                          />
                        </div>
                        <div>
                          <h6 className="fs-16 fw-medium mb-1">Adrian Marshall</h6>
                          <p className="fs-14 text-gray-6 text-truncate">
                            Have you called them?
                          </p>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="text-end">
                          <p className="mb-1 fs-14 text-gray-6">Just Now</p>
                          <div className="d-flex justify-content-end">
                            <span className="msg-count badge badge-primary d-flex align-items-center justify-content-center rounded-circle">
                              2
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="#"
                      className="d-flex justify-content-between chat-member mb-3"
                    >
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-lg online flex-shrink-0 me-2">
                          <Image
                            src="/img/users/user-19.jpg"
                            alt="User Image"
                            width={50}
                            height={50}
                            className="rounded"
                          />
                        </div>
                        <div>
                          <h6 className="fs-16 fw-medium mb-1">Robert Miller</h6>
                          <p className="fs-14 d-flex align-items-center">
                            <i className="isax isax-video5 me-1" />
                            Video
                          </p>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="text-end">
                          <p className="mb-1 fs-14 text-gray-6">5 Mins Ago</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="#"
                      className="d-flex justify-content-between chat-member mb-3"
                    >
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-lg flex-shrink-0 me-2">
                          <Image
                            src="/img/users/user-30.jpg"
                            alt="User Image"
                            width={50}
                            height={50}
                            className="rounded"
                          />
                        </div>
                        <div>
                          <h6 className="fs-16 fw-medium mb-1">Robert Miller</h6>
                          <p className="fs-14 d-flex align-items-center">
                            <i className="isax isax-document-text-15 me-1" />
                            Project Tools.doc
                          </p>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="text-end">
                          <p className="mb-1 fs-14 text-gray-6">10:20 PM</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="#"
                      className="d-flex justify-content-between chat-member mb-3"
                    >
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-lg flex-shrink-0 me-2">
                          <Image
                            src="/img/users/user-lg-26.jpg"
                            alt="User Image"
                            width={50}
                            height={50}
                            className="rounded"
                          />
                        </div>
                        <div>
                          <h6 className="fs-16 fw-medium mb-1">Williams</h6>
                          <p className="fs-14 text-gray-6 text-truncate">Ok sure!</p>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="text-end">
                          <p className="mb-1 fs-14 text-gray-6">11:20 PM</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="#"
                      className="d-flex justify-content-between chat-member mb-3"
                    >
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-lg flex-shrink-0 me-2">
                          <Image
                            src="/img/users/user-31.jpg"
                            alt="User Image"
                            width={50}
                            height={50}
                            className="rounded"
                          />
                        </div>
                        <div>
                          <h6 className="fs-16 fw-medium mb-1">Williams</h6>
                          <p className="fs-14 text-gray-6 text-truncate">Nice</p>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="text-end">
                          <p className="mb-1 fs-14 text-gray-6">11:40 PM</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="#"
                      className="d-flex justify-content-between chat-member mb-3"
                    >
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-lg flex-shrink-0 me-2">
                          <Image
                            src="/img/users/user-32.jpg"
                            alt="User Image"
                            width={50}
                            height={50}
                            className="rounded"
                          />
                        </div>
                        <div>
                          <h6 className="fs-16 fw-medium mb-1">Johnson</h6>
                          <p className="fs-14 text-gray-6 text-truncate">Thanks</p>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="text-end">
                          <p className="mb-1 fs-14 text-gray-6">12:20 PM</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="#"
                      className="d-flex justify-content-between chat-member mb-3"
                    >
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-lg flex-shrink-0 me-2">
                          <Image
                            src="/img/users/user-09.jpg"
                            alt="User Image"
                            width={50}
                            height={50}
                            className="rounded"
                          />
                        </div>
                        <div>
                          <h6 className="fs-16 fw-medium mb-1">Martinez</h6>
                          <p className="fs-14 text-gray-6 text-truncate">Welcome</p>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="text-end">
                          <p className="mb-1 fs-14 text-gray-6">1:20 PM</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
              {/* /Chat User List */}

              {/* Chat Content */}
              <div className="col-lg-8 chat-cont-right">
                <div className="card mb-0">
                  {/* Chat Header */}
                  <div className="card-header d-flex justify-content-between align-items-center">
                    {!isChatVisible ? (
                      <>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-md online flex-shrink-0 me-3">
                            <Image
                              src="/img/users/user-08.jpg"
                              alt="User Image"
                              width={40}
                              height={40}
                              className="rounded"
                            />
                          </div>
                          <div>
                            <h6 className="mb-0">Beth Williams</h6>
                            <p className="mb-0 fs-14 text-gray-6">Online</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <Link href="#" onClick={handleSearchToggle}>
                            <i className="isax isax-search-normal-14" />
                          </Link>
                          <Link href="#">
                            <i className="isax isax-video5" />
                          </Link>
                          <Link href="#">
                            <i className="isax isax-call" />
                          </Link>
                          <div className="dropdown">
                            <button 
                              className="btn btn-link p-0 border-0" 
                              type="button" 
                              data-bs-toggle="dropdown" 
                              aria-expanded="false"
                              style={{background: 'none', color: '#6b7280'}}
                            >
                              <i className="fa-solid fa-ellipsis-vertical" style={{fontSize: '18px', fontWeight: 'bold'}}>⋮</i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li><Link className="dropdown-item" href="#"><i className="fas fa-times me-2"></i>Close Chat</Link></li>
                              <li><Link className="dropdown-item" href="#"><i className="fas fa-bell-slash me-2"></i>Mute Notification</Link></li>
                              <li><Link className="dropdown-item" href="#"><i className="fas fa-eye-slash me-2"></i>Disappearing Message</Link></li>
                              <li><Link className="dropdown-item" href="#"><i className="fas fa-trash me-2"></i>Clear Message</Link></li>
                              <li><Link className="dropdown-item" href="#"><i className="fas fa-trash-alt me-2"></i>Delete Chat</Link></li>
                              <li><Link className="dropdown-item" href="#"><i className="fas fa-flag me-2"></i>Report</Link></li>
                              <li><Link className="dropdown-item" href="#"><i className="fas fa-ban me-2"></i>Block</Link></li>
                            </ul>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="d-flex align-items-center w-100">
                        <button 
                          className="btn btn-link p-0 me-3" 
                          onClick={handleSearchClose}
                        >
                          <i className="isax isax-arrow-left" />
                        </button>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="isax isax-search-normal-14" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search messages..."
                            value={searchValue}
                            onChange={handleSearchChange}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {/* /Chat Header */}

                  {/* Chat Body */}
                  <div className="card-body chat-body">
                    <div className="chat-scroll">
                      <ul className="list-unstyled chat">
                        {/* Message 1 */}
                        <li className="media sent">
                          <div className="media-body">
                            <div className="msg-box">
                              <div>
                                <div className="d-flex justify-content-between align-items-start">
                                  <p>Hello. What can I do for you?</p>
                                  <div className="dropdown message-dropdown">
                                    <button 
                                      className="btn btn-link p-0 border-0 dropdown-toggle" 
                                      type="button" 
                                      data-bs-toggle="dropdown" 
                                      aria-expanded="false"
                                    >
                                      <i className="fa fa-ellipsis-v"></i>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-reply me-2"></i>Reply</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-share me-2"></i>Forward</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-copy me-2"></i>Copy</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-star me-2"></i>Mark as Favourite</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-trash me-2"></i>Delete</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-envelope me-2"></i>Mark as Unread</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-archive me-2"></i>Archive Chat</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-thumbtack me-2"></i>Pin Chat</Link></li>
                                    </ul>
                                  </div>
                                </div>
                                <ul className="chat-msg-info">
                                  <li>
                                    <div className="chat-time">
                                      <span>8:30 AM</span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Message 2 */}
                        <li className="media received">
                          <div className="avatar flex-shrink-0">
                            <Image
                              src="/img/users/user-08.jpg"
                              alt="User Image"
                              width={35}
                              height={35}
                              className="rounded"
                            />
                          </div>
                          <div className="media-body">
                            <div className="msg-box">
                              <div>
                                <div className="d-flex justify-content-between align-items-start">
                                  <p>I'm looking for tours to Dubai</p>
                                  <div className="dropdown message-dropdown">
                                    <button 
                                      className="btn btn-link p-0 border-0 dropdown-toggle" 
                                      type="button" 
                                      data-bs-toggle="dropdown" 
                                      aria-expanded="false"
                                    >
                                      <i className="fa fa-ellipsis-v"></i>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-reply me-2"></i>Reply</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-share me-2"></i>Forward</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-copy me-2"></i>Copy</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-star me-2"></i>Mark as Favourite</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-trash me-2"></i>Delete</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-envelope me-2"></i>Mark as Unread</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-archive me-2"></i>Archive Chat</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-thumbtack me-2"></i>Pin Chat</Link></li>
                                    </ul>
                                  </div>
                                </div>
                                <ul className="chat-msg-info">
                                  <li>
                                    <div className="chat-time">
                                      <span>8:35 AM</span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Message 3 */}
                        <li className="media sent">
                          <div className="media-body">
                            <div className="msg-box">
                              <div>
                                <div className="d-flex justify-content-between align-items-start">
                                  <p>Great! We have amazing Dubai tour packages. Let me show you some options.</p>
                                  <div className="dropdown message-dropdown">
                                    <button 
                                      className="btn btn-link p-0 border-0 dropdown-toggle" 
                                      type="button" 
                                      data-bs-toggle="dropdown" 
                                      aria-expanded="false"
                                    >
                                      <i className="fa fa-ellipsis-v"></i>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-reply me-2"></i>Reply</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-share me-2"></i>Forward</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-copy me-2"></i>Copy</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-star me-2"></i>Mark as Favourite</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-trash me-2"></i>Delete</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-envelope me-2"></i>Mark as Unread</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-archive me-2"></i>Archive Chat</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-thumbtack me-2"></i>Pin Chat</Link></li>
                                    </ul>
                                  </div>
                                </div>
                                <ul className="chat-msg-info">
                                  <li>
                                    <div className="chat-time">
                                      <span>8:40 AM</span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Message 4 - Tour Image */}
                        <li className="media sent">
                          <div className="media-body">
                            <div className="msg-box">
                              <div>
                                <div className="d-flex justify-content-between align-items-start">
                                  <div className="chat-tour-group">
                                    <Image
                                      src="/img/tours/tours-14.jpg"
                                      alt="Dubai Tour"
                                      width={200}
                                      height={150}
                                      className="rounded tour-image"
                                    />
                                    <div className="tour-info">
                                      <h6>Dubai City Tour</h6>
                                      <p>5 Days • 4 Nights</p>
                                      <p className="price">$599</p>
                                    </div>
                                  </div>
                                  <div className="dropdown message-dropdown">
                                    <button 
                                      className="btn btn-link p-0 border-0 dropdown-toggle" 
                                      type="button" 
                                      data-bs-toggle="dropdown" 
                                      aria-expanded="false"
                                    >
                                      <i className="fa fa-ellipsis-v"></i>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-reply me-2"></i>Reply</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-share me-2"></i>Forward</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-copy me-2"></i>Copy</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-star me-2"></i>Mark as Favourite</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-trash me-2"></i>Delete</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-envelope me-2"></i>Mark as Unread</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-archive me-2"></i>Archive Chat</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-thumbtack me-2"></i>Pin Chat</Link></li>
                                    </ul>
                                  </div>
                                </div>
                                <ul className="chat-msg-info">
                                  <li>
                                    <div className="chat-time">
                                      <span>8:45 AM</span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Message 5 - Multiple Tours */}
                        <li className="media sent">
                          <div className="media-body">
                            <div className="msg-box">
                              <div>
                                <div className="d-flex justify-content-between align-items-start">
                                  <div className="chat-tour-group d-flex gap-3">
                                    <div className="tour-item">
                                      <Image
                                        src="/img/tours/tours-29.jpg"
                                        alt="Dubai Adventure"
                                        width={150}
                                        height={120}
                                        className="rounded"
                                      />
                                      <div className="tour-info">
                                        <h6>Dubai Adventure</h6>
                                        <p>3 Days</p>
                                        <p className="price">$399</p>
                                      </div>
                                    </div>
                                    <div className="tour-item">
                                      <Image
                                        src="/img/tours/tours-13.jpg"
                                        alt="Luxury Dubai"
                                        width={150}
                                        height={120}
                                        className="rounded"
                                      />
                                      <div className="tour-info">
                                        <h6>Luxury Dubai</h6>
                                        <p>7 Days</p>
                                        <p className="price">$999</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="dropdown message-dropdown">
                                    <button 
                                      className="btn btn-link p-0 border-0 dropdown-toggle" 
                                      type="button" 
                                      data-bs-toggle="dropdown" 
                                      aria-expanded="false"
                                    >
                                      <i className="fa fa-ellipsis-v"></i>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-reply me-2"></i>Reply</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-share me-2"></i>Forward</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-copy me-2"></i>Copy</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-star me-2"></i>Mark as Favourite</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-trash me-2"></i>Delete</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-envelope me-2"></i>Mark as Unread</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-archive me-2"></i>Archive Chat</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-thumbtack me-2"></i>Pin Chat</Link></li>
                                    </ul>
                                  </div>
                                </div>
                                <ul className="chat-msg-info">
                                  <li>
                                    <div className="chat-time">
                                      <span>8:50 AM</span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Message 6 */}
                        <li className="media received">
                          <div className="avatar flex-shrink-0">
                            <Image
                              src="/img/users/user-08.jpg"
                              alt="User Image"
                              width={35}
                              height={35}
                              className="rounded"
                            />
                          </div>
                          <div className="media-body">
                            <div className="msg-box">
                              <div>
                                <div className="d-flex justify-content-between align-items-start">
                                  <p>These look great! I'm interested in the Dubai City Tour. Can you tell me more about it?</p>
                                  <div className="dropdown message-dropdown">
                                    <button 
                                      className="btn btn-link p-0 border-0 dropdown-toggle" 
                                      type="button" 
                                      data-bs-toggle="dropdown" 
                                      aria-expanded="false"
                                    >
                                      <i className="fa fa-ellipsis-v"></i>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-reply me-2"></i>Reply</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-share me-2"></i>Forward</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-copy me-2"></i>Copy</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-star me-2"></i>Mark as Favourite</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-trash me-2"></i>Delete</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-envelope me-2"></i>Mark as Unread</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-archive me-2"></i>Archive Chat</Link></li>
                                      <li><Link className="dropdown-item" href="#"><i className="fas fa-thumbtack me-2"></i>Pin Chat</Link></li>
                                    </ul>
                                  </div>
                                </div>
                                <ul className="chat-msg-info">
                                  <li>
                                    <div className="chat-time">
                                      <span>8:55 AM</span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* /Chat Body */}

                  {/* Chat Footer */}
                  <div 
                    className="card-footer position-relative"
                    onClick={(e) => {
                      // إغلاق نافذة الإيموجي عند النقر خارجها
                      if (!e.target.closest('.emoji-picker-window') && !e.target.closest('.send-action-btn')) {
                        setIsEmojiListFootVisible(false);
                      }
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      {/* زر المرفقات */}
                      <div className="dropdown chat-attachments">
                        <button 
                          className="btn btn-attachment" 
                          type="button" 
                          data-bs-toggle="dropdown" 
                          aria-expanded="false"
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            backgroundColor: '#f3f4f6',
                            color: '#6b7280',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <i className="isax isax-paperclip" />
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <Link href="#" className="dropdown-item">
                              <i className="isax isax-camera me-2" />
                              Camera
                            </Link>
                          </li>
                          <li>
                            <Link href="#" className="dropdown-item">
                              <i className="isax isax-gallery me-2" />
                              Gallery
                            </Link>
                          </li>
                          <li>
                            <Link href="#" className="dropdown-item">
                              <i className="isax isax-microphone me-2" />
                              Audio
                            </Link>
                          </li>
                          <li>
                            <Link href="#" className="dropdown-item">
                              <i className="isax isax-location me-2" />
                              Location
                            </Link>
                          </li>
                          <li>
                            <Link href="#" className="dropdown-item">
                              <i className="isax isax-user me-2" />
                              Contact
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* شريط الإدخال الكامل */}
                      <div className="flex-fill position-relative">
                        <input
                          type="text"
                          className="form-control type_msg chat-input"
                          placeholder="Type your message here..."
                          value={currentMessage}
                          onChange={(e) => setCurrentMessage(e.target.value)}
                          style={{
                            height: '42px',
                            borderRadius: '25px',
                            paddingLeft: '18px',
                            paddingRight: '85px',
                            border: '1px solid #e9ecef',
                            width: '100%'
                          }}
                        />
                        <div className="send-action position-absolute" style={{right: '8px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '4px'}}>
                          <button
                            type="button"
                            className="send-action-btn"
                            onClick={toggleEmojiListFoot}
                            style={{
                              background: isEmojiListFootVisible ? '#530aa6' : 'transparent',
                              border: 'none',
                              padding: '4px',
                              borderRadius: '6px',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: isEmojiListFootVisible ? 'white' : '#6b7280',
                              transition: 'all 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
                              boxShadow: isEmojiListFootVisible ? '0 2px 8px rgba(83, 10, 166, 0.3)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                              if (!isEmojiListFootVisible) {
                                e.target.style.backgroundColor = '#f3f4f6';
                                e.target.style.color = '#374151';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isEmojiListFootVisible) {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#6b7280';
                              }
                            }}
                            title="Choose emoji"
                          >
                            <i className="far fa-smile" style={{fontSize: '16px'}} />
                          </button>
                          <button 
                            type="button" 
                            className="send-action-btn"
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '4px',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#6b7280',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <i className="isax isax-microphone" style={{fontSize: '16px'}} />
                          </button>
                        </div>
                      </div>

                      {/* زر الإرسال */}
                      <button 
                        className="btn btn-primary btn_send d-flex align-items-center justify-content-center"
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '8px',
                          backgroundColor: '#530aa6',
                          borderColor: '#530aa6'
                        }}
                      >
                        <i className="fa fa-paper-plane" />
                      </button>
                    </div>

                    {/* Enhanced and Fully Developed Emoji Picker */}
                    {isEmojiListFootVisible && (
                      <div 
                        className={styles.emojiPickerWindow}
                        style={{
                          position: 'absolute',
                          bottom: '65px', 
                          right: '15px', 
                          width: '340px', 
                          height: '280px',
                          zIndex: 9999, 
                          backgroundColor: '#ffffff',
                          border: '2px solid #530aa6',
                          borderRadius: '16px',
                          boxShadow: '0 20px 35px rgba(83, 10, 166, 0.25), 0 8px 15px rgba(0, 0, 0, 0.1)',
                          overflowY: 'hidden',
                          overflowX: 'hidden',
                          backdropFilter: 'blur(20px)',
                          animation: 'slideUpFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                        onMouseLeave={() => {
                          if (emojiTimeout) {
                            clearTimeout(emojiTimeout);
                          }
                          const newTimeout = setTimeout(() => {
                            setIsEmojiListFootVisible(false);
                          }, 800);
                          setEmojiTimeout(newTimeout);
                        }}
                        onMouseEnter={() => {
                          if (emojiTimeout) {
                            clearTimeout(emojiTimeout);
                            setEmojiTimeout(null);
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Enhanced Header with Gradient */}
                        <div style={{
                          padding: '10px 15px',
                          background: 'linear-gradient(135deg, #530aa6 0%, #6d28d9 100%)',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600',
                          borderRadius: '14px 14px 0 0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          boxShadow: '0 2px 10px rgba(83, 10, 166, 0.3)'
                        }}>
                          <span></span>
                          <button
                            onClick={() => {
                              setIsEmojiListFootVisible(false);
                            }}
                            style={{
                              background: 'rgba(255, 255, 255, 0.2)',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              color: 'white',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                              e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            ×
                          </button>
                        </div>
                        

                        
                        {/* Recent Emojis */}
                        {(
                          <div style={{
                            padding: '10px 15px',
                            borderBottom: '1px solid #e2e8f0'
                          }}>
                            <div style={{
                              fontSize: '11px',
                              color: '#6b7280',
                              marginBottom: '8px',
                              fontWeight: '600'
                            }}>
                              Recent
                            </div>
                            <div style={{
                              display: 'flex',
                              gap: '6px',
                              flexWrap: 'wrap'
                            }}>
                              {recentEmojis.map((emoji, index) => (
                                <button
                                  key={`recent-${index}`}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleEmojiClick(emoji);
                                  }}
                                  style={{
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    width: '28px',
                                    height: '28px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.background = 'linear-gradient(135deg, #530aa6 0%, #6d28d9 100%)';
                                    e.target.style.transform = 'scale(1.1)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
                                    e.target.style.transform = 'scale(1)';
                                  }}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Emoji Grid with Advanced Visual Effects */}
                        <div style={{
                          padding: '15px',
                          height: 'calc(100% - 106px)',
                          overflowY: 'auto',
                          overflowX: 'hidden',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(8, 1fr)',
                          gap: '8px',
                          alignContent: 'start',
                          background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)'
                        }}>
                          {emojis.map((emoji, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleEmojiClick(emoji);
                              }}
                              style={{
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                width: '32px',
                                height: '32px',
                                fontSize: '18px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                position: 'relative',
                                overflow: 'hidden'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = 'linear-gradient(135deg, #530aa6 0%, #6d28d9 100%)';
                                e.target.style.borderColor = '#530aa6';
                                e.target.style.transform = 'scale(1.15) translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(83, 10, 166, 0.4)';
                                e.target.style.zIndex = '10';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
                                e.target.style.borderColor = '#e2e8f0';
                                e.target.style.transform = 'scale(1) translateY(0)';
                                e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                                e.target.style.zIndex = '1';
                              }}
                              onMouseDown={(e) => {
                                e.target.style.transform = 'scale(1.05) translateY(-1px)';
                              }}
                              onMouseUp={(e) => {
                                e.target.style.transform = 'scale(1.15) translateY(-2px)';
                              }}
                              title={`Add ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                        

                      </div>
                    )}
                  </div>
                  {/* /Chat Footer */}
                </div>
              </div>
              {/* /Chat Content */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserChat; 
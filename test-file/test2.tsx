import React from 'react';
import Link from '@tencent/tpm-meeting/lib/Link';
import { gotoContactHandle } from './util';
import styles from './index.module.scss';

// 在这里写入页面用到的模拟数据

const videoImg =  'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/media/video.png';

const data = {
  hero: [
    {
      img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/planV2Page/bg.jpg',
      mobileImg:
        'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/planV2Page/bg-m.jpg',
      bgColor: '#eaf3fc',
      // bgRender: <img src="http://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/ComHero/servicePC.jpg"/>,
      // bgRenderMobile:<img src="http://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/ComHero/serviceMobile.jpg" alt="" />,
      logo: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/planHero/logo.png',
      title: '腾讯会议“万室如意”计划全新升级',
      desc: (
        <>
          <span className="blue-decoration">AI加持</span>
          ，为您的会议室装上更智能的千里眼和更灵敏的顺风耳
        </>
      ),
      subDesc: '——天籁会议室免费试用限时限量报名中！',
      btns: [{
        text: '立即参与',
        onClick: () => {
          gotoContactHandle({
            url: '/contact/index.html?productKey=wanshiruyi',
            type: 'banner',
          });
        },
      }],
    },
  ],
  equityCard: [
    {
      title: '万室如意大礼包',
      subTitle: ' ——天籁会议室免费升级试用',
      rightsTitle: ' 您将有机会获得',
      rights: [
        <>
          <Link onClick={() => {
            document.querySelector(`.${styles['plan-section-inside']}`)?.scrollIntoView({
              behavior: 'smooth',
            });
          }}>天赖设备</Link>试用期免费使用（不超过3个月）
        </>,
        '腾讯会议Rooms账号试用期免费使用（不超过3个月）',
        '改造解决方案咨询、全生命周期运维等腾讯会议服务商本地化服务',
      ],
      tips: [
        <>
          请查看<Link>《活动规则》</Link>再申请服务
        </>,
      ],
    },
  ],
  step: [
    {
      icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/step/submit.png',
      title: '提交加入申请',
      desc: (
        <>
          <div className="auto-part">填写您的联系方式和企业需求，我们将尽快与您联系</div>
          <div className="break-part">
          </div>
        </>
      ),
    },
    {
      icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/step/team.png',
      title: '专业团队审核',
      desc: (
        <>
          <div className="auto-part">
            我们将尽快安排相关腾讯会议代理商为您进行需求评估
          </div>
          <div className="break-part">
          </div>
        </>
      ),
    },
    {
      icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/step/sure.png',
      title: '服务方案确认',
      desc: (
        <>
          <div className="auto-part">
          评估通过后腾讯会议代理商将为您提供合适服务方案
          </div>
          <div className="break-part">
          </div>
        </>
      ),
    },
    {
      icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/step/free.png',
      title: '免费改造落地',
      desc: (
        <>
          <div className="auto-part">
          最终根据确定后的方案进行落地实施
          </div>
          <div className="break-part">
          </div>
        </>
      ),
    },
  ],
  img: 'https://cdn.meeting.tencent.com/5d7bc2d22d383f51ff40b285267f0ba0.png',
  img2: 'https://cdn.meeting.tencent.com/871152fdba329029bf958773f7275437.png',
  planRooms: {
    intro: (
      <>
        <p>腾讯会议Rooms会议室解决方案，通过与多种硬件设备集成</p>
        <p>
          提供音视频会议、无线投屏、协作白板的一站式会议体验，打造“如意”会议室
        </p>
      </>
    ),
    mobileIntro: (
      <>
        <p>腾讯会议Rooms会议室解决方案</p>
        <p>通过与多种硬件设备集成提供音视频会议</p>
        <p>无线投屏、协作白板的一站式会议体验</p>
        <p>打造“如意”会议室</p>
      </>
    ),
    tabs: [
      {
        id: 'listen',
        label: '听得清楚',
      },
      {
        id: 'look',
        label: '看得真切',
      },
      {
        id: 'speak',
        label: '讲得明白',
      },
      {
        id: 'use',
        label: '用得顺心',
      },
      {
        id: 'manage',
        label: '管得省心',
      },
    ],
    tabsCnt: [
      {
        id: 'listen',
        video:
          'http://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/PlanRooms/listen-24.mp4',
        img: 'http://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/PlanRooms/listen.gif',
      },
      {
        id: 'look',
        video:
          'http://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/PlanRooms/look-24.mp4',
        img: 'http://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/PlanRooms/look.gif',
      },
      {
        video:
          'http://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/PlanRooms/speak-24.mp4',
        id: 'speak',
        img: 'http://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/PlanRooms/speak.gif',
      },
      {
        id: 'use',
        video:
          'http://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/PlanRooms/use-min.mp4',
        img: 'http://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/PlanRooms/use.gif',
      },
      {
        video:
          'http://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/PlanRooms/manage-24.mp4',
        id: 'manage',
        img: 'http://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/PlanRooms/manage.gif',
      },
    ],
  },
  function: {
    showPlayBtn: false,
    type: 'tag',
    v2: true,
    col: 3,
    items: [
      {
        img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/videoPage/demo-cover.jpg',
        title: '智能“千里眼”',
        desc: '让会议室发言人时刻被看到',
      },
      {
        img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/videoPage/demo-cover.jpg',
        title: '更优秀的去混响能力',
        desc: '大型会议空间里的“顺风耳”',
      },
      {
        img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/videoPage/demo-cover.jpg',
        title: '智能音幕重磅上线',
        desc: '打造特定区域的“专属麦克风”',
      },
    ],
  },
  videoCards: [
    {
      img: videoImg,
      duration: '4:28',
      title: '怎样只花5000元就让小型会议室开上视频会议？',
    },
    {
      img: videoImg,
      duration: '4:28',
      title: '怎样只花5000元就让小型会议室开上视频会议？',
    },
    {
      img: videoImg,
      duration: '4:28',
      title: '怎样只花5000元就让小型会议室开上视频会议？',
    },
    {
      img: videoImg,
      duration: '4:28',
      title: '怎样只花5000元就让小型会议室开上视频会议？',
    },
    {
      img: videoImg,
      duration: '4:28',
      title: '怎样只花5000元就让小型会议室开上视频会议？',
    },
    {
      img: videoImg,
      duration: '4:28',
      title: '怎样只花5000元就让小型会议室开上视频会议？',
    },
  ],
  inside: {
    items: [
      {
        icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/logo/maxhub.png',
        imgs: [
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/Hamedal-A21T.png',
            text: 'Hamedal A21T',
          },
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/A31S.png',
            text: 'A31S（敬请期待）',
          },
        ],
      },
      {
        icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/logo/hamedal.png',
        imgs: [
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/Hamedal-A21T.png',
            text: 'Hamedal A21T',
          },
        ],
      },
      {
        icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/logo/kindlink.png',
        imgs: [
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/ac21m.png',
            text: 'ac21m',
          },
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/default.png',
            text: '敬请期待',
          },
        ],
      },
      {
        icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/logo/newline.png',
        imgs: [
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/TC-86.png',
            text: 'TC系列（65/65A/86）',
          },
        ],
      },
      {
        icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/logo/yhd.png',
        imgs: [
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/M710T.png',
            text: 'M710T',
          },
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/default.png',
            text: '敬请期待',
          },
        ],
      },
      {
        icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/logo/harion.png',
        imgs: [
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/M6T.png',
            text: 'M6T',
          },
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/default.png',
            text: '敬请期待',
          },
        ],
      },
      {
        icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/logo/hitry.png',
        imgs: [
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/HiBoard-S65-C.png',
            text: 'HiBoard-S65-C',
          },
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/ASP30.png',
            text: 'ASP30',
          },
        ],
      },
      {
        icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/logo/hisense.png',
        imgs: [
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/Hisense-P.png',
            text: 'Hisense 专业款P系列（MR）',
          },
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/Hisense-U.png',
            text: 'Hisense 旗舰款U系列（MZ）',
          },
        ],
      },
      {
        icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/logo/dahua.png',
        imgs: [
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/proS2.png',
            text: '专业款S2',
          },
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/default.png',
            text: '敬请期待',
          },
        ],
      },
      {
        icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/logo/tcl.png',
        imgs: [
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/IFP.png',
            text: 'IFP',
          },
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/default.png',
            text: '敬请期待',
          },
        ],
      },
    ],
    items1: [
      {
        icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/logo/maxhub.png',
        imgs: [
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/PF.png',
            text: 'MAXHUB CC/PF系列',
          },
        ],
      },
    ],
    items2: [
      {
        icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/logo/maxhub.png',
        imgs: [
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/PF.png',
            text: 'MAXHUB CC/PF系列',
          },
        ],
      },
      {
        icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/logo/hamedal.png',
        imgs: [
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/Hamedal-A21T.png',
            text: 'Hamedal A21T',
          },
        ],
      },
      {
        icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/logo/kindlink.png',
        imgs: [
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/ac21m.png',
            text: 'ac21m',
          },
        ],
      },
    ],
    items3: [
      {
        icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/logo/maxhub.png',
        imgs: [
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/PF.png',
            text: 'MAXHUB CC/PF系列',
          },
        ],
      },
      {
        icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/logo/hamedal.png',
        imgs: [
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/Hamedal-A21T.png',
            text: 'Hamedal A21T',
          },
        ],
      },
      {
        icon: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/logo/kindlink.png',
        imgs: [
          {
            img: 'https://assets.woa.com/open_proj/proj_qcloud_v2/tpm-meeting/src/public/InsideV2/product/ac21m.png',
            text: 'ac21m',
          },
        ],
      },
    ],
  },
  faq: [
    {
      id: 1,
      title: '参与“万室如意”计划的企业，需要与腾讯会议置换哪些权益？',
      content:
        '腾讯会议及其生态伙伴与企业进行沟通，并对现场会议室环境进行勘察，共同商议、选定1间中小型会议室提供免费改造，所涵括费用支持包括硬件设备、软件账号、软装服务等，仅限签署协议的企业使用。',
    },
    {
      id: 2,
      title: '企业入选“万室如意”计划的标准是什么？',
      content:
        '腾讯会议及其生态伙伴与企业进行沟通，并对现场会议室环境进行勘察，共同商议、选定1间中小型会议室提供免费改造，所涵括费用支持包括硬件设备、软件账号、软装服务等，仅限签署协议的企业使用。',
    },
    {
      id: 3,
      title:
        '企业获得尊享版服务计划，其会议室参与免费改造，能够涵括哪些费用支持？',
      content:
        '腾讯会议及其生态伙伴与企业进行沟通，并对现场会议室环境进行勘察，共同商议、选定1间中小型会议室提供免费改造，所涵括费用支持包括硬件设备、软件账号、软装服务等，仅限签署协议的企业使用。',
    },
    {
      id: 4,
      title: '企业从报名参与至改造完成的周期为多长时间？',
      content:
        '腾讯会议及其生态伙伴与企业进行沟通，并对现场会议室环境进行勘察，共同商议、选定1间中小型会议室提供免费改造，所涵括费用支持包括硬件设备、软件账号、软装服务等，仅限签署协议的企业使用。',
    },
    {
      id: 5,
      title:
        '参与“万室如意”计划的企业免费使用时限到期后，如需继续使用或升级将如何计费？',
      content:
        '腾讯会议及其生态伙伴与企业进行沟通，并对现场会议室环境进行勘察，共同商议、选定1间中小型会议室提供免费改造，所涵括费用支持包括硬件设备、软件账号、软装服务等，仅限签署协议的企业使用。',
    },
    {
      id: 6,
      title: '获得尊享版服务计划的企业，如果已有硬件设备能否利旧升级？',
      content:
        '腾讯会议及其生态伙伴与企业进行沟通，并对现场会议室环境进行勘察，共同商议、选定1间中小型会议室提供免费改造，所涵括费用支持包括硬件设备、软件账号、软装服务等，仅限签署协议的企业使用。',
    },
  ],
};

export default data;

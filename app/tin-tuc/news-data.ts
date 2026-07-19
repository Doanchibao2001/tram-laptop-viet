export type NewsSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type NewsArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  publishedLabel: string;
  updatedAt: string;
  readTime: string;
  image: string;
  imageAlt: string;
  keywords: string[];
  sections: NewsSection[];
};

export const newsArticles: NewsArticle[] = [
  {
    slug: "laptop-khong-len-nguon-nguyen-nhan-cach-xu-ly",
    title: "Laptop không lên nguồn: 7 nguyên nhân và cách xử lý an toàn",
    description: "Nhận biết nguyên nhân laptop không lên nguồn, các bước kiểm tra an toàn tại nhà và thời điểm nên mang máy đến kỹ thuật viên.",
    category: "Kinh nghiệm sửa laptop",
    publishedAt: "2026-07-19",
    publishedLabel: "19/07/2026",
    updatedAt: "2026-07-19",
    readTime: "6 phút đọc",
    image: "/tram-laptop-viet/storefront-main.png",
    imageAlt: "Cửa hàng Trạm Laptop Việt sửa laptop không lên nguồn",
    keywords: ["laptop không lên nguồn", "sửa laptop không lên nguồn", "laptop bật không lên"],
    sections: [
      {
        id: "dau-hieu",
        heading: "Dấu hiệu laptop không lên nguồn thường gặp",
        paragraphs: [
          "Laptop không lên nguồn có thể biểu hiện theo nhiều cách: bấm nút nguồn không có phản hồi, đèn sạc không sáng, quạt quay rồi tắt, màn hình đen nhưng bàn phím vẫn có đèn hoặc máy chỉ khởi động khi cắm sạc. Việc phân biệt đúng dấu hiệu giúp tránh thay nhầm linh kiện.",
          "Nếu máy vừa bị rơi, vào nước, có mùi khét hoặc nóng bất thường, hãy ngắt sạc và không tiếp tục thử bật. Cố cấp nguồn nhiều lần có thể làm chập lan sang các linh kiện đang còn hoạt động tốt.",
        ],
      },
      {
        id: "nguyen-nhan",
        heading: "7 nguyên nhân khiến laptop bật không lên",
        paragraphs: [
          "Nguyên nhân có thể nằm ở bộ sạc, pin, nút nguồn hoặc mạch nguồn trên mainboard. Một số trường hợp màn hình hỏng khiến người dùng tưởng máy không lên nguồn dù hệ thống vẫn đang chạy.",
        ],
        bullets: [
          "Ổ điện, dây nguồn hoặc adapter sạc không cấp đủ điện.",
          "Pin cạn sâu, pin lỗi hoặc chân tiếp xúc pin kém.",
          "Nút nguồn, cáp nút nguồn hoặc bàn phím tích hợp nút nguồn bị hỏng.",
          "RAM lỏng hoặc lỗi khiến máy bật nhưng không hoàn tất quá trình khởi động.",
          "Màn hình, cáp màn hình hoặc đèn nền hỏng.",
          "Mạch sạc và mạch nguồn trên mainboard gặp sự cố.",
          "Máy bị ẩm, vào nước hoặc chập sau va đập.",
        ],
      },
      {
        id: "kiem-tra-tai-nha",
        heading: "Các bước kiểm tra an toàn tại nhà",
        paragraphs: [
          "Hãy thử một ổ điện khác, quan sát đèn trên adapter và kiểm tra đầu sạc có lỏng hay nóng bất thường không. Với máy có pin tháo rời, có thể tháo pin, giữ nút nguồn khoảng 15 giây, sau đó cắm sạc và thử khởi động lại.",
          "Không tự tháo mainboard, chập chân nguồn hoặc dùng adapter khác điện áp. Những thao tác này có thể gây hư hỏng nặng hơn và làm mất dữ liệu. Nếu máy vẫn không phản hồi sau các bước cơ bản, nên dừng thử và chuyển sang kiểm tra chuyên dụng.",
        ],
      },
      {
        id: "khi-nao-can-sua",
        heading: "Khi nào nên mang laptop đi kiểm tra?",
        paragraphs: [
          "Bạn nên mang máy đi kiểm tra khi đèn sạc chớp bất thường, máy tự tắt ngay sau khi bật, có dấu hiệu vào nước hoặc adapter phát tiếng kêu. Kỹ thuật viên cần đo nguồn, kiểm tra pin, RAM, màn hình và mạch nguồn trước khi kết luận.",
          "Tại Trạm Laptop Việt, máy được kiểm tra đúng lỗi và báo giá trước khi sửa. Khách hàng chỉ quyết định thực hiện sau khi đã biết phương án, chi phí dự kiến và chính sách bảo hành.",
        ],
      },
    ],
  },
  {
    slug: "nang-cap-ssd-ram-cho-laptop",
    title: "Nâng cấp SSD và RAM cho laptop: Khi nào thực sự cần thiết?",
    description: "Hướng dẫn xác định laptop nên nâng cấp SSD, RAM hay cả hai để cải thiện tốc độ mà không tốn chi phí không cần thiết.",
    category: "Nâng cấp laptop",
    publishedAt: "2026-07-18",
    publishedLabel: "18/07/2026",
    updatedAt: "2026-07-19",
    readTime: "7 phút đọc",
    image: "/tram-laptop-viet/service-banner.jpg",
    imageAlt: "Dịch vụ nâng cấp SSD và RAM cho laptop tại Trạm Laptop Việt",
    keywords: ["nâng cấp SSD laptop", "nâng cấp RAM laptop", "laptop chạy chậm"],
    sections: [
      {
        id: "phan-biet",
        heading: "SSD và RAM cải thiện điều gì?",
        paragraphs: [
          "SSD ảnh hưởng rõ nhất đến thời gian khởi động Windows, mở ứng dụng và sao chép dữ liệu. RAM là vùng nhớ tạm giúp máy xử lý nhiều chương trình cùng lúc. Vì vậy, nâng SSD không thay thế hoàn toàn cho RAM và ngược lại.",
          "Một laptop dùng ổ cứng HDD thường cải thiện tốc độ rất rõ sau khi chuyển sang SSD. Trong khi đó, máy đã có SSD nhưng thường xuyên đầy bộ nhớ khi mở nhiều tab trình duyệt, họp trực tuyến hoặc chạy phần mềm đồ họa sẽ cần thêm RAM.",
        ],
      },
      {
        id: "dau-hieu-nang-cap",
        heading: "Dấu hiệu máy cần nâng cấp",
        paragraphs: [
          "Bạn nên kiểm tra mức sử dụng ổ đĩa và bộ nhớ trong Task Manager trước khi mua linh kiện. Nếu Disk thường xuyên đạt 100% dù máy không sao chép dữ liệu, ổ lưu trữ có thể là điểm nghẽn. Nếu Memory luôn trên 85% khi làm việc, dung lượng RAM hiện tại có thể không đủ.",
        ],
        bullets: [
          "Máy mất nhiều phút để khởi động hoặc mở ứng dụng.",
          "Chuyển đổi giữa các cửa sổ chậm, trình duyệt thường tải lại tab.",
          "Phần mềm báo thiếu bộ nhớ hoặc tự đóng khi xử lý tệp lớn.",
          "Ổ C gần đầy khiến Windows khó cập nhật và tạo bộ nhớ tạm.",
        ],
      },
      {
        id: "chon-linh-kien",
        heading: "Cách chọn SSD và RAM tương thích",
        paragraphs: [
          "SSD laptop phổ biến ở chuẩn SATA 2.5 inch và M.2, trong đó M.2 có thể sử dụng giao tiếp SATA hoặc NVMe. Hai ổ có hình dạng tương tự nhưng không phải máy nào cũng hỗ trợ cả hai chuẩn. RAM cũng cần đúng thế hệ DDR, tốc độ và dung lượng tối đa mà mainboard nhận được.",
          "Trước khi nâng cấp, cần tra đúng model máy và kiểm tra số khe còn trống. Một số laptop mỏng dùng RAM hàn trên mainboard nên không thể thay thế. Lựa chọn đúng ngay từ đầu giúp tránh mua linh kiện không tương thích.",
        ],
      },
      {
        id: "sao-luu-du-lieu",
        heading: "Đừng bỏ qua việc sao lưu dữ liệu",
        paragraphs: [
          "Nếu thay ổ lưu trữ, hãy sao lưu tài liệu quan trọng trước khi cài mới hoặc sao chép hệ điều hành. Sau nâng cấp cần kiểm tra sức khỏe SSD, dung lượng nhận đủ và chạy thử các tác vụ thường dùng.",
          "Trạm Laptop Việt kiểm tra cấu hình, tư vấn mức nâng cấp phù hợp nhu cầu và báo giá trước khi lắp. Linh kiện được kiểm tra lại sau khi hoàn tất và ghi rõ thời gian bảo hành.",
        ],
      },
    ],
  },
  {
    slug: "cach-bao-quan-pin-laptop-ben-hon",
    title: "Cách bảo quản pin laptop bền hơn và những thói quen nên tránh",
    description: "Các thói quen sạc pin đúng cách, kiểm soát nhiệt độ và nhận biết thời điểm cần thay pin laptop an toàn.",
    category: "Chăm sóc laptop",
    publishedAt: "2026-07-17",
    publishedLabel: "17/07/2026",
    updatedAt: "2026-07-19",
    readTime: "5 phút đọc",
    image: "/tram-laptop-viet/brand-banner.jpg",
    imageAlt: "Hướng dẫn bảo quản và thay pin laptop tại Trạm Laptop Việt",
    keywords: ["bảo quản pin laptop", "pin laptop bị chai", "thay pin laptop"],
    sections: [
      {
        id: "pin-lithium",
        heading: "Hiểu đúng về pin laptop hiện nay",
        paragraphs: [
          "Phần lớn laptop hiện đại sử dụng pin lithium-ion hoặc lithium-polymer. Loại pin này không cần chờ cạn hoàn toàn mới sạc. Việc thường xuyên để pin về 0% và giữ máy trong trạng thái cạn lâu ngày có thể làm pin suy giảm nhanh hơn.",
          "Tuổi thọ pin phụ thuộc vào số chu kỳ sạc, nhiệt độ, công suất sử dụng và chất lượng cell pin. Vì vậy, không có một mốc thời gian giống nhau cho mọi laptop.",
        ],
      },
      {
        id: "thoi-quen-tot",
        heading: "5 thói quen giúp pin bền hơn",
        paragraphs: [
          "Mục tiêu quan trọng nhất là hạn chế nhiệt độ cao và tránh để pin cạn sâu thường xuyên. Khi làm việc cố định, có thể bật chế độ giới hạn sạc nếu phần mềm của hãng hỗ trợ.",
        ],
        bullets: [
          "Dùng bộ sạc đúng công suất và chuẩn kết nối của máy.",
          "Đặt laptop trên bề mặt phẳng để khe tản nhiệt thông thoáng.",
          "Tránh vừa sạc vừa chạy tác vụ nặng trong môi trường nóng.",
          "Không để pin cạn 0% trong thời gian dài.",
          "Cập nhật BIOS và phần mềm quản lý pin từ hãng khi cần thiết.",
        ],
      },
      {
        id: "dau-hieu-chai-pin",
        heading: "Dấu hiệu pin đã chai hoặc không còn an toàn",
        paragraphs: [
          "Pin tụt nhanh, máy tắt đột ngột dù còn phần trăm, chỉ dùng được khi cắm sạc hoặc hệ điều hành báo cần bảo trì là các dấu hiệu thường gặp. Trường hợp vỏ máy phồng, bàn phím hoặc touchpad bị đội lên cần ngừng sử dụng và kiểm tra sớm.",
          "Không chọc thủng, ép hoặc tiếp tục sạc một viên pin đang phồng. Pin hỏng cần được tháo và xử lý đúng cách bởi người có chuyên môn.",
        ],
      },
      {
        id: "chon-pin-thay-the",
        heading: "Chọn pin thay thế và kiểm tra sau khi lắp",
        paragraphs: [
          "Pin thay thế phải đúng mã, điện áp và thiết kế đầu nối. Sau khi lắp cần kiểm tra khả năng nhận sạc, nhiệt độ, dung lượng thiết kế và thời gian sử dụng thực tế.",
          "Trạm Laptop Việt kiểm tra tình trạng pin, bộ sạc và mạch sạc trước khi đề xuất thay thế. Khách hàng được báo giá trước và nhận thông tin bảo hành rõ ràng khi bàn giao máy.",
        ],
      },
    ],
  },
];

export function getNewsArticle(slug: string) {
  return newsArticles.find((article) => article.slug === slug);
}

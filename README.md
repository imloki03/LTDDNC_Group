# Xây dựng và phát triển nền tảng quản lý dự án lập trình cho sinh viên

## Mục Lục

1. [Giới Thiệu](#giới-thiệu)
2. [Các Actor](#các-actor)
3. [Mô tả các usecase](#mô-tả-usecase)
   - [Đăng ký](#đăng-ký)
   - [Đăng nhập](#đăng-nhập)
   - [Chatting](#chatting)
   - [Quản Lý Dự Án](#quản-lý-dự-án)
   - [Quản Lý Người Cộng Tác](#quản-lý-người-cộng-tác)
   - [Quản Lý Công Việc](#quản-lý-công-việc)
   - [Quản Lý Phiên Bản](#quản-lý-phiên-bản)
   - [Quản Lý Lưu trữ](#quản-lý-lưu-trữ)

## Giới Thiệu

Hệ thống được phát triển với mục tiêu cung cấp một công cụ quản lý dự án lập trình hiệu quả và khoa học, đặc biệt được tùy biến phù hợp với nhu cầu của sinh viên. Hệ thống này nhằm giải quyết các khó khăn thực tế mà sinh viên gặp phải trong quá trình thực hiện các dự án lập trình, như việc phải sử dụng nhiều nền tảng và công cụ rời rạc, gây khó khăn trong việc quản lý thông tin, phân chia công việc, chia sẻ tệp tin, và quản lý mã nguồn. Bằng cách tích hợp các chức năng quản lý dự án trong một nền tảng duy nhất, hệ thống giúp tăng cường sự tổ chức, tiết kiệm thời gian, và nâng cao hiệu quả làm việc nhóm, từ đó hỗ trợ sinh viên hoàn thành các dự án lập trình một cách chuyên nghiệp và có hệ thống hơn.

## Các Actor

- **Guest (Khách)**:
  - **Đăng ký**.
  - **Đăng nhập**.

- **User (Người Dùng)**:
  - **Đăng nhập**.
  - **Quản lý lưu trữ (Storage management)**.
  - **Quản lý cộng tác viên (Collaborator management)**.
  - **Quản lý dự án (Project management)**.
  - **Chatting**.
  - **Quản lý phiên bản (Version management)**.
  - **Quản lý công việc (Task management)**.
  - **Đăng xuất (Logout)**.

## Mô tả các usecase
#### Đăng Ký
Người dùng mới có thể đăng ký tài khoản bằng email, mật khẩu và một số thông tin cá nhân.

#### Đăng Nhập
Người dùng có thể đăng nhập vào hệ thống thông qua việc xác thực và cấp quyền cho hệ thống với tài khoản Github. Lần đầu tiên đăng nhập vào hệ thống, người dùng cần phải xác thực với email cá nhân để đảm bảo an toàn dữ liệu dự án khi xảy ra vấn đề với tài khoản Github. Nếu không thể truy cập vào tài khoản Github, người dùng có thể đăng nhập vào hệ thống thông qua OTP được gửi qua email đã xác thực trước đó.

### Chatting
Người dùng trong cùng một dự án có thể thảo luận trực tiếp với nhau thông qua hệ thống tin nhắn. Các thành viên trong dự án có thể gửi tin nhắn văn bản, hình ảnh, hoặc file liên quan đến công việc.

### Quản Lý Dự Án

Người dùng có thể tạo dự án mới và liên kết với repository trên GitHub để quản lý mã nguồn. Họ có thể cập nhật thông tin dự án như thay đổi tên, đổi repository hoặc chuyển quyền sở hữu dự án cho người dùng khác. Hệ thống cung cấp các công cụ thống kê để người dùng theo dõi tiến độ và tổng quan dự án.

### Quản Lý Người Cộng Tác

Người dùng quản lý dự án (Project Owner - PO) có thể mời người dùng khác tham gia dự án. Các collaborator phải chấp nhận lời mời để tham gia chính thức. PO có thể điều chỉnh quyền của từng collaborator hoặc xóa họ khỏi dự án. Collaborator có thể trao đổi thông qua kênh trò chuyện riêng trong dự án.

### Quản Lý Công Việc

Người dùng quản lý dự án có thể tạo các công việc để lập kế hoạch thực hiện dự án, phân công công việc cho các collaborator. Collaborator có thể nộp lại kết quả công việc dưới dạng phiên bản tạm thời (draft version) để PO và các thành viên khác đưa ra phản hồi. Khi một công việc được hoàn thành, hệ thống sẽ tạo ra phiên bản ổn định (stable version) và lưu trữ lại.

### Quản Lý Phiên Bản

Người dùng quản lý dự án có thể sao lưu phiên bản ổn định của dự án sau mỗi công việc. Họ có thể chỉnh sửa thông tin của phiên bản đó và quyết định khôi phục dự án về phiên bản ổn định trước đó.

### Quản Lý lưu trữ

Người dùng có thể lưu trữ các file liên quan đến dự án dưới nhiều định dạng khác nhau như tài liệu, hình ảnh, bản trình bày,... Hệ thống cũng lưu lại các phiên bản cũ của file khi người dùng cập nhật phiên bản mới.

![Sơ Đồ Usecase](https://github.com/imloki03/LTDDNC_Group/blob/main/Usercase.png)
